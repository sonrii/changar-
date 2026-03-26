'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/Button';
import { signOut } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { LogOut, Briefcase, Globe } from 'lucide-react';
import { useWorldApp } from '@/hooks/useWorldApp';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { isWorldApp, isLoading: worldLoading } = useWorldApp();

  const handleSignOut = async () => {
    try {
      console.log('[Layout] Signing out user');
      await signOut();
      console.log('[Layout] Sign out successful, redirecting to home');
      router.push('/');
    } catch (error) {
      console.error('[Layout] Error signing out:', error);
      // Still redirect to home even if sign out fails
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile-first compact header with safe area */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="text-primary-600" size={20} />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">ChangAR</h1>
              {!worldLoading && isWorldApp && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  <Globe size={12} />
                  World App
                </span>
              )}
            </div>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-sm"
              >
                <LogOut size={14} className="mr-1" />
                Salir
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content with mobile-optimized spacing */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-safe">
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{title}</h2>
        )}
        {children}
      </main>
    </div>
  );
};
