/**
 * World Mini App Adapter
 * 
 * Real World Mini App SDK integration using official MiniKit APIs.
 * Provides a clean interface for World-specific features while
 * preserving the Firebase-based implementation as fallback.
 */

import { WorldMiniAppContext } from './types';
import { detectMiniAppEnvironment } from './detector';

/**
 * Get MiniKit instance safely (client-side only).
 * Returns null if not in browser or MiniKit not available.
 */
function getMiniKit() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const { MiniKit } = require('@worldcoin/minikit-js');
    return MiniKit;
  } catch (error) {
    console.warn('[WorldAdapter] MiniKit not available:', error);
    return null;
  }
}

/**
 * Get World Mini App context.
 * 
 * Uses real MiniKit APIs to determine World App state.
 * Returns actual installation status and available features.
 */
export function getWorldContext(): WorldMiniAppContext {
  const MiniKit = getMiniKit();
  
  if (!MiniKit) {
    return {
      isWorldApp: false,
      hasWallet: false,
      isVerified: false,
    };
  }

  const isInstalled = MiniKit.isInstalled();
  
  return {
    isWorldApp: isInstalled,
    hasWallet: isInstalled, // If installed, wallet features are available
    isVerified: false, // Verification status would come from actual auth flow
  };
}

/**
 * Initialize World Mini App SDK.
 * 
 * This is handled automatically by MiniKitProvider in the app layout.
 * This function is kept for compatibility with the existing abstraction layer.
 */
export async function initializeWorldSDK(): Promise<void> {
  const isInWorldApp = detectMiniAppEnvironment();
  
  if (isInWorldApp) {
    console.log('[WorldAdapter] Running inside World App - MiniKit initialized via provider');
  } else {
    console.log('[WorldAdapter] Running in browser mode - MiniKit not initialized');
  }
}

/**
 * Authenticate with World ID.
 * 
 * Note: Full World ID authentication requires:
 * 1. App to be registered in World Developer Portal
 * 2. Valid NEXT_PUBLIC_WORLD_APP_ID configured
 * 3. Backend verification endpoint setup
 * 
 * This function provides the structure but will fail gracefully
 * if credentials are not configured.
 */
export async function authenticateWithWorld(): Promise<{ userId: string; verified: boolean }> {
  const MiniKit = getMiniKit();
  
  if (!MiniKit || !MiniKit.isInstalled()) {
    throw new Error('World App not detected. Please open this app inside World App or use Firebase authentication.');
  }

  const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID;
  
  if (!appId) {
    throw new Error('World App ID not configured. Set NEXT_PUBLIC_WORLD_APP_ID in environment variables. Using Firebase authentication as fallback.');
  }

  try {
    // Note: Actual World ID verification would use MiniKit.commands.verify()
    // This requires backend setup and proper app registration
    // For now, we provide the structure and fail with clear messaging
    
    console.log('[WorldAdapter] World authentication requires:');
    console.log('1. App registered in World Developer Portal');
    console.log('2. Backend verification endpoint configured');
    console.log('3. Valid app credentials');
    console.log('Please use Firebase authentication until World app is fully configured.');
    
    throw new Error('World authentication not fully configured. Use Firebase auth for now.');
  } catch (error: any) {
    console.error('[WorldAdapter] World auth error:', error);
    throw error;
  }
}

/**
 * Check if World verification is available.
 * 
 * Returns true if running in World App and app ID is configured.
 */
export function isWorldVerificationAvailable(): boolean {
  const MiniKit = getMiniKit();
  const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID;
  
  return !!(MiniKit && MiniKit.isInstalled() && appId);
}
