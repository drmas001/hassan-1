import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Key } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';
import FormInput from '../components/auth/FormInput';
import FormButton from '../components/auth/FormButton';
import FormMessage from '../components/auth/FormMessage';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name }
      });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h2>

          {message.text && (
            <FormMessage type={message.type as 'success' | 'error'}>
              {message.text}
            </FormMessage>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="employeeCode"
              label="Employee Code"
              icon={User}
              type="text"
              value={user.email?.split('@')[0] || ''}
              disabled
            />

            <FormInput
              id="name"
              label="Name"
              icon={Mail}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormInput
              id="role"
              label="Role"
              icon={Shield}
              type="text"
              value={user.user_metadata.role || ''}
              disabled
            />

            <div className="flex justify-between items-center pt-4">
              <FormButton
                type="button"
                variant="secondary"
                icon={Key}
                onClick={() => navigate('/change-password')}
              >
                Change Password
              </FormButton>

              <FormButton
                type="submit"
                loading={loading}
              >
                Save Changes
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}