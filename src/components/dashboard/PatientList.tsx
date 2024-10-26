import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle, UserMinus, Skull } from 'lucide-react';
import type { Patient } from '../../types';

const StatusBadge = ({ status }: { status: Patient['status'] }) => {
  const colors = {
    Critical: 'bg-red-100 text-red-800',
    Serious: 'bg-orange-100 text-orange-800',
    Stable: 'bg-green-100 text-green-800',
    Discharged: 'bg-teal-100 text-teal-800',
    Deceased: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

export default function PatientList({ patients }: { patients: Patient[] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Current Patients</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {patients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => navigate(`/patients/${patient.id}`)}
            className="w-full text-left p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-500">Code: {patient.personalCode}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <StatusBadge status={patient.status} />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{patient.attendingPhysician}</p>
                  <p className="text-sm text-gray-500">
                    {patient.status === 'Discharged' && patient.dischargeDate
                      ? `Discharged: ${new Date(patient.dischargeDate).toLocaleDateString()}`
                      : patient.status === 'Deceased' && patient.deathDate
                      ? `Deceased: ${new Date(patient.deathDate).toLocaleDateString()}`
                      : `Admitted: ${new Date(patient.admissionDate).toLocaleDateString()}`}
                  </p>
                </div>
                {patient.status === 'Critical' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                {patient.status === 'Discharged' && (
                  <UserMinus className="w-5 h-5 text-teal-500" />
                )}
                {patient.status === 'Deceased' && (
                  <Skull className="w-5 h-5 text-gray-500" />
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}