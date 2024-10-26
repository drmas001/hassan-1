import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/auth/FormInput';
import FormButton from '../components/auth/FormButton';
import FormMessage from '../components/auth/FormMessage';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeCode.trim() || !password.trim()) {
      setError('Please enter both employee code and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signIn(employeeCode.trim(), password.trim());
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid employee code or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="ICU Management System">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <FormMessage type="error">{error}</FormMessage>}

        <FormInput
          id="employeeCode"
          label="Employee Code"
          icon={User}
          type="text"
          required
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          placeholder="Enter your employee code"
          autoComplete="username"
          autoFocus
          disabled={loading}
        />

        <FormInput
          id="password"
          label="Password"
          icon={Lock}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>
        </div>

        <FormButton
          type="submit"
          loading={loading}
          fullWidth
        >
          Sign in
        </FormButton>
      </form>
    </AuthLayout>
  );
}