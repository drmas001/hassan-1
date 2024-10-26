import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FormInput from '../components/auth/FormInput';
import FormButton from '../components/auth/FormButton';
import FormMessage from '../components/auth/FormMessage';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Change Password</h2>

          {error && (
            <FormMessage type="error">
              {error}
            </FormMessage>
          )}

          {success && (
            <FormMessage type="success">
              Password updated successfully! Redirecting...
            </FormMessage>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="currentPassword"
              label="Current Password"
              icon={Lock}
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <FormInput
              id="newPassword"
              label="New Password"
              icon={Lock}
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <FormInput
              id="confirmPassword"
              label="Confirm New Password"
              icon={Lock}
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex justify-end space-x-3">
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </FormButton>
              <FormButton
                type="submit"
                loading={loading}
              >
                Update Password
              </FormButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}