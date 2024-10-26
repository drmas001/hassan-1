-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    employee_code TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Admin')),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    personal_code TEXT UNIQUE NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    status TEXT NOT NULL CHECK (status IN ('Stable', 'Critical', 'Serious', 'Discharged', 'Deceased')),
    attending_physician_id UUID REFERENCES users(id),
    admission_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    discharge_date TIMESTAMPTZ,
    death_date TIMESTAMPTZ,
    diagnosis TEXT NOT NULL,
    discharge_reason TEXT,
    cause_of_death TEXT,
    discharge_summary TEXT,
    follow_up_plan TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vital_signs table
CREATE TABLE vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    blood_pressure TEXT NOT NULL,
    heart_rate INTEGER NOT NULL CHECK (heart_rate >= 0),
    temperature DECIMAL(4,1) NOT NULL,
    oxygen_saturation INTEGER NOT NULL CHECK (oxygen_saturation BETWEEN 0 AND 100),
    respiratory_rate INTEGER NOT NULL CHECK (respiratory_rate >= 0),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    recorded_by_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lab_results table
CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Normal', 'Abnormal', 'Critical')),
    ordered_by_id UUID REFERENCES users(id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create medications table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Completed', 'Discontinued')),
    prescribed_by_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('status', 'lab', 'medication', 'discharge', 'death')),
    message TEXT NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_attending_physician ON patients(attending_physician_id);
CREATE INDEX idx_vital_signs_patient_recorded ON vital_signs(patient_id, recorded_at);
CREATE INDEX idx_lab_results_patient_recorded ON lab_results(patient_id, recorded_at);
CREATE INDEX idx_medications_patient_status ON medications(patient_id, status);
CREATE INDEX idx_notifications_patient_read ON notifications(patient_id, read);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create notification triggers
CREATE OR REPLACE FUNCTION create_patient_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Critical' THEN
        INSERT INTO notifications (type, message, patient_id, severity)
        VALUES ('status', 'Patient status changed to Critical', NEW.id, 'critical');
    ELSIF NEW.status = 'Discharged' THEN
        INSERT INTO notifications (type, message, patient_id, severity)
        VALUES ('discharge', 'Patient has been discharged', NEW.id, 'info');
    ELSIF NEW.status = 'Deceased' THEN
        INSERT INTO notifications (type, message, patient_id, severity)
        VALUES ('death', 'Patient is deceased', NEW.id, 'critical');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER patient_status_notification
    AFTER UPDATE OF status ON patients
    FOR EACH ROW
    EXECUTE FUNCTION create_patient_notification();

-- Create RLS policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Doctors can view and modify all patient data
CREATE POLICY doctors_all_access ON patients
    FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'Doctor'
    ));

-- Nurses can view all patient data but only modify vital signs
CREATE POLICY nurses_read_access ON patients
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'Nurse'
    ));

-- Create views for common queries
CREATE VIEW current_patients AS
SELECT 
    p.*,
    u.name as physician_name,
    vs.blood_pressure,
    vs.heart_rate,
    vs.temperature,
    vs.oxygen_saturation,
    vs.respiratory_rate
FROM patients p
LEFT JOIN users u ON p.attending_physician_id = u.id
LEFT JOIN LATERAL (
    SELECT DISTINCT ON (patient_id)
        blood_pressure, heart_rate, temperature, oxygen_saturation, respiratory_rate
    FROM vital_signs
    WHERE patient_id = p.id
    ORDER BY patient_id, recorded_at DESC
) vs ON true
WHERE p.status NOT IN ('Discharged', 'Deceased');

-- Create function to get patient statistics
CREATE OR REPLACE FUNCTION get_patient_statistics(start_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_patients INTEGER,
    critical_patients INTEGER,
    stable_patients INTEGER,
    new_admissions INTEGER,
    discharged_today INTEGER,
    deaths_today INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_patients,
        COUNT(*) FILTER (WHERE status = 'Critical')::INTEGER as critical_patients,
        COUNT(*) FILTER (WHERE status = 'Stable')::INTEGER as stable_patients,
        COUNT(*) FILTER (WHERE DATE(admission_date) = start_date)::INTEGER as new_admissions,
        COUNT(*) FILTER (WHERE DATE(discharge_date) = start_date)::INTEGER as discharged_today,
        COUNT(*) FILTER (WHERE DATE(death_date) = start_date)::INTEGER as deaths_today
    FROM patients;
END;
$$ LANGUAGE plpgsql;