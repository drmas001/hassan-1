export interface Patient {
  id: string;
  name: string;
  personalCode: string;
  status: 'Stable' | 'Critical' | 'Serious' | 'Discharged' | 'Deceased';
  attendingPhysician: string;
  admissionDate: string;
  dischargeDate?: string;
  deathDate?: string;
  dischargeReason?: string;
  causeOfDeath?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  vitalSigns?: VitalSigns;
  labResults?: LabResult[];
  medications?: Medication[];
  notes?: string;
  dischargeSummary?: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  timestamp: string;
}

export interface LabResult {
  id: string;
  type: string;
  value: string;
  unit: string;
  timestamp: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'Discontinued';
}

export interface QuickStats {
  totalPatients: number;
  criticalPatients: number;
  stablePatients: number;
  newAdmissions: number;
  dischargedToday: number;
  deathsToday: number;
}

export interface Notification {
  id: string;
  type: 'status' | 'lab' | 'medication' | 'discharge' | 'death';
  message: string;
  timestamp: string;
  patientId: string;
  severity: 'info' | 'warning' | 'critical';
}