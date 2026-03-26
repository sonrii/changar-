import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#1E293B] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6 border border-[#334155]',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:border-primary-600/50 active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
};
