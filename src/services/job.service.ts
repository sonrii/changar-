import {
  collection,
  doc,
  getDoc,
  addDoc,
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
import { JobRequest, JobRequestWithClient, Oficio, Zone, Urgency, JobRequestStatus, TradeCategory } from '@/types';
import { getUser } from './user.service';

const COLLECTION = 'job_requests';

export const createJobRequest = async (data: {
  clientUid: string;
  oficio: Oficio;
  category?: TradeCategory;
  title: string;
  description: string;
  zone: Zone;
  urgency: Urgency;
  contactMethod: string;
}): Promise<string> => {
  console.log('[JobService] createJobRequest called with data:', data);
  
  const requestsRef = collection(db, COLLECTION);
  
  // Prepare request data
  const requestData = {
    ...data,
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Remove undefined fields before writing to Firestore
  const sanitizedData = removeUndefinedFields(requestData);

  console.log('[JobService] Writing sanitized data to Firestore:', sanitizedData);
  const docRef = await addDoc(requestsRef, sanitizedData);
  console.log('[JobService] Job request created with ID:', docRef.id);
  
  return docRef.id;
};

export const getJobRequest = async (id: string): Promise<JobRequest | null> => {
  const requestRef = doc(db, COLLECTION, id);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    return null;
  }

  const data = requestSnap.data();
  return {
    id: requestSnap.id,
    clientUid: data.clientUid,
    oficio: data.oficio,
    category: data.category,
    title: data.title,
    description: data.description,
    zone: data.zone,
    urgency: data.urgency,
    contactMethod: data.contactMethod,
    status: data.status,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
};

export const getJobRequestWithClient = async (id: string): Promise<JobRequestWithClient | null> => {
  const request = await getJobRequest(id);
  if (!request) return null;

  const client = await getUser(request.clientUid);
  if (!client) return null;

  return {
    ...request,
    clientName: client.fullName,
    clientPhone: client.phone,
  };
};

export const updateJobRequest = async (
  id: string,
  data: Partial<Omit<JobRequest, 'id' | 'clientUid' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  console.log('[JobService] updateJobRequest called for id:', id);
  console.log('[JobService] Update data:', data);

  const requestRef = doc(db, COLLECTION, id);
  
  // Prepare update data
  const updateData = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Remove undefined fields before writing to Firestore
  const sanitizedData = removeUndefinedFields(updateData);

  console.log('[JobService] Sanitized update data:', sanitizedData);
  await updateDoc(requestRef, sanitizedData);
  console.log('[JobService] Job request successfully updated');
};

export const getClientJobRequests = async (clientUid: string): Promise<JobRequest[]> => {
  const requestsRef = collection(db, COLLECTION);
  const q = query(
    requestsRef,
    where('clientUid', '==', clientUid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      clientUid: data.clientUid,
      oficio: data.oficio,
      category: data.category,
      title: data.title,
      description: data.description,
      zone: data.zone,
      urgency: data.urgency,
      contactMethod: data.contactMethod,
      status: data.status,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });
};

export const searchJobRequests = async (filters: {
  oficio?: Oficio;
  zone?: Zone;
  status?: JobRequestStatus;
}): Promise<JobRequestWithClient[]> => {
  const requestsRef = collection(db, COLLECTION);
  let q = query(requestsRef);

  if (filters.status) {
    q = query(q, where('status', '==', filters.status));
  } else {
    q = query(q, where('status', '==', 'open'));
  }

  if (filters.oficio) {
    q = query(q, where('oficio', '==', filters.oficio));
  }

  if (filters.zone) {
    q = query(q, where('zone', '==', filters.zone));
  }

  q = query(q, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  const requests = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      clientUid: data.clientUid,
      oficio: data.oficio,
      category: data.category,
      title: data.title,
      description: data.description,
      zone: data.zone,
      urgency: data.urgency,
      contactMethod: data.contactMethod,
      status: data.status,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });

  const requestsWithClients = await Promise.all(
    requests.map(async (request) => {
      const client = await getUser(request.clientUid);
      return {
        ...request,
        clientName: client?.fullName || '',
        clientPhone: client?.phone,
      };
    })
  );

  return requestsWithClients;
};
