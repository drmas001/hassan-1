import React from 'react';
import { Clock, Check, XCircle } from 'lucide-react';
import type { Medication } from '../../types';

const statusIcons = {
  Active: <Clock className="h-5 w-5 text-blue-500" />,
  Completed: <Check className="h-5 w-5 text-green-500" />,
  Discontinued: <XCircle className="h-5 w-5 text-red-500" />,
};

export default function Medications({ medications }: { medications: Medication[] }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {medications.map((medication) => (
          <li key={medication.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {statusIcons[medication.status]}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                  <p className="text-sm text-gray-500">
                    {medication.dosage} - {medication.frequency}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Started: {new Date(medication.startDate).toLocaleDateString()}</p>
                {medication.endDate && (
                  <p>Ended: {new Date(medication.endDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}