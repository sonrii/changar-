import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { removeUndefinedFields } from '@/lib/firestore-utils';
import { WorkerProfile, WorkerProfileWithUser, Oficio, Zone, TradeCategory } from '@/types';
import { getUser } from './user.service';

const COLLECTION = 'worker_profiles';

export const createWorkerProfile = async (data: {
  uid: string;
  oficio: Oficio;
  category?: TradeCategory;
  zone: Zone;
  description: string;
  availableNow: boolean;
  whatsapp?: string;
}): Promise<void> => {
  console.log('[WorkerService] createWorkerProfile called with data:', data);
  console.log('[WorkerService] Firestore collection:', COLLECTION);
  console.log('[WorkerService] Document path: worker_profiles/' + data.uid);

  try {
    const profileRef = doc(db, COLLECTION, data.uid);
    console.log('[WorkerService] Document reference created');

    // Prepare profile data with all fields
    const profileData = {
      ...data,
      ratingAverage: 0,
      totalReviews: 0,
      activeProfile: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Remove undefined fields before writing to Firestore
    // Firestore does not accept undefined values
    const sanitizedData = removeUndefinedFields(profileData);

    console.log('[WorkerService] Writing profile data to Firestore:', sanitizedData);
    await setDoc(profileRef, sanitizedData);
    console.log('[WorkerService] Profile successfully written to Firestore');
  } catch (error: any) {
    console.error('[WorkerService] Error writing to Firestore:', error);
    console.error('[WorkerService] Error code:', error.code);
    console.error('[WorkerService] Error message:', error.message);
    throw error;
  }
};

export const getWorkerProfile = async (uid: string): Promise<WorkerProfile | null> => {
  const profileRef = doc(db, COLLECTION, uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    return null;
  }

  const data = profileSnap.data();
  return {
    uid: profileSnap.id,
    oficio: data.oficio,
    category: data.category,
    zone: data.zone,
    description: data.description,
    availableNow: data.availableNow,
    whatsapp: data.whatsapp,
    ratingAverage: data.ratingAverage || 0,
    totalReviews: data.totalReviews || 0,
    activeProfile: data.activeProfile,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
};

export const updateWorkerProfile = async (
  uid: string,
  data: Partial<Omit<WorkerProfile, 'uid' | 'createdAt' | 'updatedAt' | 'ratingAverage' | 'totalReviews'>>
): Promise<void> => {
  console.log('[WorkerService] updateWorkerProfile called for uid:', uid);
  console.log('[WorkerService] Update data:', data);

  const profileRef = doc(db, COLLECTION, uid);
  
  // Prepare update data
  const updateData = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Remove undefined fields before writing to Firestore
  const sanitizedData = removeUndefinedFields(updateData);

  console.log('[WorkerService] Sanitized update data:', sanitizedData);
  await updateDoc(profileRef, sanitizedData);
  console.log('[WorkerService] Profile successfully updated');
};

export const getWorkerProfileWithUser = async (uid: string): Promise<WorkerProfileWithUser | null> => {
  const [profile, user] = await Promise.all([
    getWorkerProfile(uid),
    getUser(uid),
  ]);

  if (!profile || !user) {
    return null;
  }

  return {
    ...profile,
    fullName: user.fullName,
    phone: user.phone,
    verificationStatus: user.verificationStatus,
  };
};

export const searchWorkers = async (filters: {
  oficio?: Oficio;
  zone?: Zone;
  availableNow?: boolean;
}): Promise<WorkerProfileWithUser[]> => {
  const workersRef = collection(db, COLLECTION);
  let q = query(workersRef, where('activeProfile', '==', true));

  if (filters.oficio) {
    q = query(q, where('oficio', '==', filters.oficio));
  }

  if (filters.zone) {
    q = query(q, where('zone', '==', filters.zone));
  }

  if (filters.availableNow !== undefined) {
    q = query(q, where('availableNow', '==', filters.availableNow));
  }

  q = query(q, orderBy('updatedAt', 'desc'));

  const snapshot = await getDocs(q);
  const profiles = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      oficio: data.oficio,
      category: data.category,
      zone: data.zone,
      description: data.description,
      availableNow: data.availableNow,
      whatsapp: data.whatsapp,
      ratingAverage: data.ratingAverage || 0,
      totalReviews: data.totalReviews || 0,
      activeProfile: data.activeProfile,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });

  const profilesWithUsers = await Promise.all(
    profiles.map(async (profile) => {
      const user = await getUser(profile.uid);
      return {
        ...profile,
        fullName: user?.fullName || '',
        phone: user?.phone,
        verificationStatus: user?.verificationStatus || 'none',
      };
    })
  );

  return profilesWithUsers;
};
