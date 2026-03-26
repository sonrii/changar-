import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]',
    secondary: 'bg-success-500 text-white hover:bg-success-600 shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
    outline: 'border-2 border-[#334155] text-gray-300 hover:bg-[#1E293B] hover:border-primary-600',
    ghost: 'text-gray-400 hover:bg-[#1E293B] hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-2xl min-h-[40px]',
    md: 'px-6 py-3 text-base rounded-2xl min-h-[48px]',
    lg: 'px-8 py-4 text-lg rounded-2xl min-h-[56px]',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
