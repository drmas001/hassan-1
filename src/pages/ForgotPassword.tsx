import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/auth/AuthLayout';
import FormInput from '../components/auth/FormInput';
import FormButton from '../components/auth/FormButton';
import FormMessage from '../components/auth/FormMessage';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send reset instructions'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you instructions to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {message.text && (
          <FormMessage type={message.type as 'success' | 'error'}>
            {message.text}
          </FormMessage>
        )}

        <FormInput
          id="email"
          label="Email address"
          icon={Mail}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <FormButton
          type="submit"
          loading={loading}
          fullWidth
        >
          Send Reset Instructions
        </FormButton>

        <div className="text-sm text-center">
          <FormButton
            type="button"
            variant="secondary"
            onClick={() => navigate('/login')}
          >
            Back to login
          </FormButton>
        </div>
      </form>
    </AuthLayout>
  );
}