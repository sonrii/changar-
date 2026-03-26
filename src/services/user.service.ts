import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserRole, Zone } from '@/types';

const COLLECTION = 'users';

export const createUser = async (data: {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  cityRegion: Zone;
  phone?: string;
}): Promise<void> => {
  console.log('[UserService] Creating user document:', { uid: data.uid, role: data.role });
  const userRef = doc(db, COLLECTION, data.uid);
  await setDoc(userRef, {
    ...data,
    verificationStatus: 'none',
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('[UserService] User document created successfully');
};

export const getUser = async (uid: string): Promise<User | null> => {
  console.log('[UserService] Fetching user document:', uid);
  const userRef = doc(db, COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.warn('[UserService] User document does not exist:', uid);
    return null;
  }

  const data = userSnap.data();
  console.log('[UserService] User document found:', { uid, role: data.role });
  return {
    uid: userSnap.id,
    role: data.role,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    cityRegion: data.cityRegion,
    verificationStatus: data.verificationStatus,
    isActive: data.isActive,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
};

export const updateUser = async (
  uid: string,
  data: Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const userRef = doc(db, COLLECTION, uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};
