import React from 'react';
import PatientHeader from '../components/patient/PatientHeader';
import VitalSigns from '../components/patient/VitalSigns';
import LabResults from '../components/patient/LabResults';
import Medications from '../components/patient/Medications';
import type { Patient } from '../types';

// Mock data for demonstration
const mockPatient: Patient = {
  id: '1',
  name: 'John Doe',
  personalCode: 'ICU-2024-001',
  status: 'Stable',
  attendingPhysician: 'Smith',
  admissionDate: '2024-03-10',
  age: 45,
  gender: 'Male',
  diagnosis: 'Acute Respiratory Distress Syndrome',
  vitalSigns: {
    bloodPressure: '120/80',
    heartRate: 85,
    temperature: 37.2,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    timestamp: new Date().toISOString(),
  },
  labResults: [
    {
      id: '1',
      type: 'Complete Blood Count',
      value: '14.5',
      unit: 'g/dL',
      timestamp: new Date().toISOString(),
      status: 'Normal',
    },
    {
      id: '2',
      type: 'Blood Glucose',
      value: '180',
      unit: 'mg/dL',
      timestamp: new Date().toISOString(),
      status: 'Abnormal',
    },
  ],
  medications: [
    {
      id: '1',
      name: 'Methylprednisolone',
      dosage: '40mg',
      frequency: 'Every 12 hours',
      startDate: new Date().toISOString(),
      status: 'Active',
    },
    {
      id: '2',
      name: 'Enoxaparin',
      dosage: '40mg',
      frequency: 'Once daily',
      startDate: new Date().toISOString(),
      status: 'Active',
    },
  ],
};

export default function PatientDetails() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PatientHeader patient={mockPatient} />
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h2>
        <VitalSigns vitals={mockPatient.vitalSigns} />
      </div>
      
      <div className="mt-8 space-y-8">
        <LabResults results={mockPatient.labResults} />
        <Medications medications={mockPatient.medications} />
      </div>
    </div>
  );
}