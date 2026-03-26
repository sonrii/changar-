import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Application, ApplicationWithWorker, ApplicationStatus, Oficio } from '@/types';
import { getWorkerProfile } from './worker.service';
import { getUser } from './user.service';

const COLLECTION = 'applications';

export const createApplication = async (data: {
  requestId: string;
  workerUid: string;
  message: string;
}): Promise<string> => {
  const applicationsRef = collection(db, COLLECTION);
  const docRef = await addDoc(applicationsRef, {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getApplication = async (id: string): Promise<Application | null> => {
  const appRef = doc(db, COLLECTION, id);
  const appSnap = await getDoc(appRef);

  if (!appSnap.exists()) {
    return null;
  }

  const data = appSnap.data();
  return {
    id: appSnap.id,
    requestId: data.requestId,
    workerUid: data.workerUid,
    message: data.message,
    status: data.status,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
};

export const updateApplication = async (
  id: string,
  data: Partial<Omit<Application, 'id' | 'requestId' | 'workerUid' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const appRef = doc(db, COLLECTION, id);
  await updateDoc(appRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const getRequestApplications = async (requestId: string): Promise<ApplicationWithWorker[]> => {
  const applicationsRef = collection(db, COLLECTION);
  const q = query(
    applicationsRef,
    where('requestId', '==', requestId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const applications = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      requestId: data.requestId,
      workerUid: data.workerUid,
      message: data.message,
      status: data.status,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });

  const applicationsWithWorkers = await Promise.all(
    applications.map(async (app) => {
      const [worker, user] = await Promise.all([
        getWorkerProfile(app.workerUid),
        getUser(app.workerUid),
      ]);

      return {
        ...app,
        workerName: user?.fullName || '',
        workerOficio: (worker?.oficio || 'albanil') as Oficio,
        workerZone: worker?.zone || 'CABA',
        workerRating: worker?.ratingAverage || 0,
        workerPhone: user?.phone,
      };
    })
  );

  return applicationsWithWorkers;
};

export const getWorkerApplications = async (workerUid: string): Promise<Application[]> => {
  const applicationsRef = collection(db, COLLECTION);
  const q = query(
    applicationsRef,
    where('workerUid', '==', workerUid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      requestId: data.requestId,
      workerUid: data.workerUid,
      message: data.message,
      status: data.status,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });
};

export const checkExistingApplication = async (
  requestId: string,
  workerUid: string
): Promise<boolean> => {
  const applicationsRef = collection(db, COLLECTION);
  const q = query(
    applicationsRef,
    where('requestId', '==', requestId),
    where('workerUid', '==', workerUid)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
