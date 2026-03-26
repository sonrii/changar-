import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-solid border-primary-600 border-r-transparent ${sizeClasses[size]}`}></div>
  );
};

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ text = 'Cargando...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0F172A] flex flex-col items-center justify-center z-50">
        <LoadingSpinner size="lg" />
        <p className="mt-6 text-gray-400 text-lg font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner />
      <p className="mt-4 text-gray-400 font-medium">{text}</p>
    </div>
  );
};
