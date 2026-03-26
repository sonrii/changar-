/**
 * Auth Strategy Service
 * 
 * Provides a unified authentication interface that supports multiple auth modes:
 * - Firebase email/password (current)
 * - World Mini App auth (future)
 * 
 * This abstraction allows the app to switch between auth providers without
 * refactoring the entire codebase.
 */

import { getPlatformConfig } from '@/lib/platform';
import * as firebaseAuth from './auth.service';
import { User } from '@/types';

export type AuthStrategy = 'firebase' | 'world';

/**
 * Get the current auth strategy based on platform configuration.
 */
export function getCurrentAuthStrategy(): AuthStrategy {
  const config = getPlatformConfig();
  return config.authMode;
}

/**
 * Sign up with the current auth strategy.
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: 'client' | 'worker',
  cityRegion: string
): Promise<void> {
  const strategy = getCurrentAuthStrategy();
  
  switch (strategy) {
    case 'firebase':
      await firebaseAuth.signUp(email, password, fullName, role, cityRegion);
      break;
    
    case 'world':
      // Future: Implement World auth sign up
      throw new Error('World authentication not yet implemented');
    
    default:
      throw new Error(`Unknown auth strategy: ${strategy}`);
  }
}

/**
 * Sign in with the current auth strategy.
 */
export async function signIn(email: string, password: string): Promise<void> {
  const strategy = getCurrentAuthStrategy();
  
  switch (strategy) {
    case 'firebase':
      await firebaseAuth.signIn(email, password);
      break;
    
    case 'world':
      // Future: Implement World auth sign in
      throw new Error('World authentication not yet implemented');
    
    default:
      throw new Error(`Unknown auth strategy: ${strategy}`);
  }
}

/**
 * Sign out from the current auth strategy.
 */
export async function signOut(): Promise<void> {
  const strategy = getCurrentAuthStrategy();
  
  switch (strategy) {
    case 'firebase':
      await firebaseAuth.signOut();
      break;
    
    case 'world':
      // Future: Implement World auth sign out
      throw new Error('World authentication not yet implemented');
    
    default:
      throw new Error(`Unknown auth strategy: ${strategy}`);
  }
}

/**
 * Listen to auth state changes for the current auth strategy.
 * 
 * Note: This is a placeholder for future multi-auth support.
 * Currently only Firebase auth is implemented.
 * The callback receives our custom User type from Firestore.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  const strategy = getCurrentAuthStrategy();
  
  switch (strategy) {
    case 'firebase':
      // Firebase auth service already handles the conversion from Firebase User to our User type
      // Type assertion is safe here because firebaseAuth.onAuthChange converts Firebase User to our User type
      return firebaseAuth.onAuthChange(callback as any);
    
    case 'world':
      // Future: Implement World auth state listener
      throw new Error('World authentication not yet implemented');
    
    default:
      throw new Error(`Unknown auth strategy: ${strategy}`);
  }
}
