import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function FormButton({
  children,
  icon: Icon,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  ...props
}: FormButtonProps) {
  const baseStyles = "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full justify-center' : ''}
        ${loading || props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${props.className || ''}
      `}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {loading ? 'Loading...' : children}
    </button>
  );
}