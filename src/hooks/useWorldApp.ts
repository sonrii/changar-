/**
 * useWorldApp Hook
 * 
 * React hook for accessing World Mini App context and features.
 * Provides real-time detection of World App environment.
 */

'use client';

import { useEffect, useState } from 'react';
import { getWorldContext, isWorldVerificationAvailable } from '@/lib/platform/world-adapter';
import { detectMiniAppEnvironment } from '@/lib/platform';

export function useWorldApp() {
  const [isWorldApp, setIsWorldApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if running in World App
    const checkEnvironment = () => {
      try {
        const inWorldApp = detectMiniAppEnvironment();
        setIsWorldApp(inWorldApp);
        
        if (inWorldApp) {
          console.log('[useWorldApp] Running inside World App');
        } else {
          console.log('[useWorldApp] Running in browser mode');
        }
      } catch (error) {
        console.error('[useWorldApp] Error detecting environment:', error);
        setIsWorldApp(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnvironment();
  }, []);

  const context = getWorldContext();
  const verificationAvailable = isWorldVerificationAvailable();

  return {
    isWorldApp,
    isLoading,
    hasWallet: context.hasWallet,
    isVerified: context.isVerified,
    verificationAvailable,
  };
}
