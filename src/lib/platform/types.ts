/**
 * Platform Types
 * 
 * Type definitions for platform detection and mini app integration.
 */

export type PlatformEnvironment = 'browser' | 'miniapp';

export type AuthMode = 'firebase' | 'world';

export interface PlatformConfig {
  environment: PlatformEnvironment;
  authMode: AuthMode;
  isMiniApp: boolean;
  supportsWorldAuth: boolean;
}

export interface WorldMiniAppContext {
  // Future: World Mini App specific context
  // Will be populated when World SDK is integrated
  isWorldApp: boolean;
  hasWallet: boolean;
  isVerified: boolean;
}
