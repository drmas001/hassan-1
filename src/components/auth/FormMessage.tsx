import React from 'react';

interface FormMessageProps {
  type: 'success' | 'error';
  children: React.ReactNode;
}

export default function FormMessage({ type, children }: FormMessageProps) {
  const styles = {
    success: 'bg-green-50 text-green-700',
    error: 'bg-red-50 text-red-700'
  };

  return (
    <div className={`mb-4 p-4 rounded-md ${styles[type]}`}>
      {children}
    </div>
  );
}