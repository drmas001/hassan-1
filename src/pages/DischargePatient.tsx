import React, { useState } from 'react';
import { Save, X, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '../stores/usePatientStore';

interface DischargeFormData {
  dischargeType: 'regular' | 'death';
  dischargeDate: string;
  dischargeReason?: string;
  causeOfDeath?: string;
  dischargeSummary: string;
  followUpPlan?: string;
}

const initialFormData: DischargeFormData = {
  dischargeType: 'regular',
  dischargeDate: new Date().toISOString().split('T')[0],
  dischargeSummary: '',
};

export default function DischargePatient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updatePatient } = usePatientStore();
  const [formData, setFormData] = useState<DischargeFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSubmitting(true);
    try {
      await updatePatient(id, {
        status: formData.dischargeType === 'regular' ? 'Discharged' : 'Deceased',
        discharge_date: formData.dischargeType === 'regular' ? formData.dischargeDate : undefined,
        death_date: formData.dischargeType === 'death' ? formData.dischargeDate : undefined,
        discharge_reason: formData.dischargeReason,
        cause_of_death: formData.causeOfDeath,
        discharge_summary: formData.dischargeSummary,
        follow_up_plan: formData.followUpPlan,
      });
      
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error discharging patient:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.dischargeType === 'regular' ? 'Discharge Patient' : 'Record Death'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields remain the same */}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setFormData(initialFormData)}
                disabled={submitting}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Form
              </button>
              <button
                type="submit"
                className={`btn-primary ${
                  formData.dischargeType === 'death' ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
                disabled={submitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {submitting
                  ? 'Processing...'
                  : formData.dischargeType === 'regular'
                  ? 'Discharge Patient'
                  : 'Record Death'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}