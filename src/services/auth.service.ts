import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserRole } from '@/types';
import { createUser, getUser } from './user.service';

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
  cityRegion: string
): Promise<FirebaseUser> => {
  console.log('[AuthService] Creating Firebase user:', email);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  console.log('[AuthService] Firebase user created:', user.uid);

  console.log('[AuthService] Creating Firestore user document');
  await createUser({
    uid: user.uid,
    email,
    fullName,
    role,
    cityRegion: cityRegion as any,
  });
  console.log('[AuthService] Firestore user document created successfully');

  return user;
};

export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  const user = await getUser(uid);
  return user?.role || null;
};
