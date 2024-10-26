import React from 'react';
import { User, Calendar, UserCheck, UserMinus, Skull } from 'lucide-react';
import type { Patient } from '../../types';

export default function PatientHeader({ patient }: { patient: Patient }) {
  const getStatusIcon = () => {
    switch (patient.status) {
      case 'Discharged':
        return <UserMinus className="h-5 w-5 text-teal-500" />;
      case 'Deceased':
        return <Skull className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <User className="h-12 w-12 text-gray-400" />
              <div className="ml-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                  {getStatusIcon()}
                </div>
                <p className="text-sm text-gray-500">ID: {patient.personalCode}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-1 h-4 w-4" />
                {patient.status === 'Discharged' && patient.dischargeDate
                  ? `Discharged: ${new Date(patient.dischargeDate).toLocaleDateString()}`
                  : patient.status === 'Deceased' && patient.deathDate
                  ? `Deceased: ${new Date(patient.deathDate).toLocaleDateString()}`
                  : `Admitted: ${new Date(patient.admissionDate).toLocaleDateString()}`}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <UserCheck className="mr-1 h-4 w-4" />
                Dr. {patient.attendingPhysician}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.age} years</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Gender</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.gender}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Primary Diagnosis</dt>
            <dd className="mt-1 text-sm text-gray-900">{patient.diagnosis}</dd>
          </div>
          {(patient.status === 'Discharged' || patient.status === 'Deceased') && (
            <div className="sm:col-span-3">
              <dt className="text-sm font-medium text-gray-500">
                {patient.status === 'Discharged' ? 'Discharge Summary' : 'Death Summary'}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{patient.dischargeSummary}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}