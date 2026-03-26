/**
 * Platform Detector
 * 
 * Detects the current platform environment (browser vs mini app).
 * Provides a clean abstraction for platform-specific behavior.
 */

import { PlatformEnvironment, PlatformConfig } from './types';

/**
 * Detect if the app is running inside a World Mini App container.
 * 
 * Uses the official MiniKit.isInstalled() method to detect World App environment.
 * This will only return true when the app is opened inside the World App.
 */
export function detectMiniAppEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Dynamically import MiniKit to avoid SSR issues
    // MiniKit.isInstalled() returns true only when running inside World App
    const { MiniKit } = require('@worldcoin/minikit-js');
    return MiniKit.isInstalled();
  } catch (error) {
    // If MiniKit is not available or fails to load, assume browser mode
    console.log('[Platform] MiniKit not available, running in browser mode');
    return false;
  }
}

/**
 * Get the current platform environment.
 */
export function getPlatformEnvironment(): PlatformEnvironment {
  return detectMiniAppEnvironment() ? 'miniapp' : 'browser';
}

/**
 * Get the complete platform configuration.
 */
export function getPlatformConfig(): PlatformConfig {
  const isMiniApp = detectMiniAppEnvironment();
  
  return {
    environment: isMiniApp ? 'miniapp' : 'browser',
    authMode: 'firebase', // Current: always Firebase. Future: 'world' when in mini app
    isMiniApp,
    supportsWorldAuth: false, // Future: true when World SDK is integrated
  };
}

/**
 * Check if the app is running in a mobile viewport.
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.innerWidth < 768;
}

/**
 * Check if the device supports touch.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
