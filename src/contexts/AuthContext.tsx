'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '@/services/auth.service';
import { getUser } from '@/services/user.service';
import { User } from '@/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      try {
        console.log('[AuthContext] Loading user data for:', fbUser.uid);
        const userData = await getUser(fbUser.uid);
        if (userData) {
          console.log('[AuthContext] User data loaded:', { uid: userData.uid, role: userData.role });
          setUser(userData);
        } else {
          console.warn('[AuthContext] No user document found for:', fbUser.uid);
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Error loading user data:', error);
        setUser(null);
      }
    } else {
      console.log('[AuthContext] No Firebase user, clearing user data');
      setUser(null);
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      await loadUserData(firebaseUser);
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Setting up auth listener');
    const unsubscribe = onAuthChange(async (fbUser) => {
      console.log('[AuthContext] Auth state changed:', fbUser ? fbUser.uid : 'null');
      setFirebaseUser(fbUser);
      await loadUserData(fbUser);
    });

    return () => {
      console.log('[AuthContext] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
