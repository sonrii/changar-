import { useState, useEffect } from 'react';
import { WorkerProfile, WorkerProfileWithUser } from '@/types';
import { getWorkerProfile, getWorkerProfileWithUser } from '@/services/worker.service';

export const useWorkerProfile = (uid: string | null) => {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!uid) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getWorkerProfile(uid);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Error loading worker profile:', err);
        setError('Error al cargar el perfil');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [uid]);

  return { profile, loading, error, refresh: () => {} };
};

export const useWorkerProfileWithUser = (uid: string | null) => {
  const [profile, setProfile] = useState<WorkerProfileWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getWorkerProfileWithUser(uid);
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error loading worker profile:', err);
      setError('Error al cargar el perfil');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [uid]);

  return { profile, loading, error, refresh: loadProfile };
};
