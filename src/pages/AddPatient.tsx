import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hash, Calendar, UserPlus, FileText, UserCheck } from 'lucide-react';
import { usePatientStore } from '../stores/usePatientStore';
import FormInput from '../components/auth/FormInput';
import FormButton from '../components/auth/FormButton';
import FormMessage from '../components/auth/FormMessage';

interface FormData {
  name: string;
  personalCode: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  attendingPhysician: string;
  notes: string;
}

const initialFormData: FormData = {
  name: '',
  personalCode: '',
  age: '',
  gender: 'Male',
  diagnosis: '',
  attendingPhysician: '',
  notes: '',
};

export default function AddPatient() {
  const navigate = useNavigate();
  const { addPatient } = usePatientStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addPatient({
        name: formData.name,
        personal_code: formData.personalCode,
        age: parseInt(formData.age),
        gender: formData.gender,
        diagnosis: formData.diagnosis,
        attending_physician_id: formData.attendingPhysician,
        status: 'Stable',
        history: formData.notes,
        admission_date: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to add patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Add New Patient</h2>

          {error && <FormMessage type="error">{error}</FormMessage>}
          {success && (
            <FormMessage type="success">
              Patient added successfully! Redirecting to dashboard...
            </FormMessage>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="name"
              name="name"
              label="Patient Name"
              icon={User}
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <FormInput
              id="personalCode"
              name="personalCode"
              label="Patient ID"
              icon={Hash}
              type="text"
              required
              value={formData.personalCode}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="age"
                name="age"
                label="Age"
                icon={Calendar}
                type="number"
                required
                min="0"
                max="150"
                value={formData.age}
                onChange={handleChange}
              />

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <FormInput
              id="diagnosis"
              name="diagnosis"
              label="Primary Diagnosis"
              icon={FileText}
              type="text"
              required
              value={formData.diagnosis}
              onChange={handleChange}
            />

            <FormInput
              id="attendingPhysician"
              name="attendingPhysician"
              label="Attending Physician"
              icon={UserCheck}
              type="text"
              required
              value={formData.attendingPhysician}
              onChange={handleChange}
            />

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </FormButton>
              <FormButton
                type="submit"
                loading={loading}
                icon={UserPlus}
              >
                Add Patient
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}