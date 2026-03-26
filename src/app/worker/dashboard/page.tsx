'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { JobRequestCard } from '@/components/JobRequestCard';
import { Select } from '@/components/ui/Select';
import { getWorkerProfile } from '@/services/worker.service';
import { searchJobRequests } from '@/services/job.service';
import { TRADE_CATEGORIES, SUBTRADES_BY_CATEGORY, ZONES, getSubtradesForCategory } from '@/lib/constants';
import { JobRequestWithClient, Oficio, Zone, TradeCategory } from '@/types';
import { Briefcase, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WorkerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [requests, setRequests] = useState<JobRequestWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<TradeCategory | ''>('');
  const [oficioFilter, setOficioFilter] = useState<Oficio | ''>('');
  const [zoneFilter, setZoneFilter] = useState<Zone | ''>('');

  // Get available subtrades based on selected category
  const availableSubtrades = categoryFilter ? getSubtradesForCategory(categoryFilter) : [];

  // Handle category change - reset subtrade
  const handleCategoryChange = (newCategory: string) => {
    setCategoryFilter(newCategory as TradeCategory);
    setOficioFilter(''); // Reset subtrade when category changes
  };

  useEffect(() => {
    console.log('[WorkerDashboard] Auth state:', { authLoading, user: user ? { uid: user.uid, role: user.role } : null });
    
    if (authLoading) {
      return; // Wait for auth to load
    }
    
    if (!user) {
      console.log('[WorkerDashboard] No user, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'worker') {
      console.log('[WorkerDashboard] User is not a worker, redirecting to home');
      router.push('/');
      return;
    }
    
    console.log('[WorkerDashboard] User authenticated as worker');
  }, [user, authLoading, router]);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      try {
        const profile = await getWorkerProfile(user.uid);
        if (!profile) {
          router.push('/worker/profile/create');
          return;
        }
        setHasProfile(true);
        setOficioFilter(profile.oficio);
        setZoneFilter(profile.zone);
      } catch (error) {
        console.error('Error checking profile:', error);
        toast.error('Error al cargar el perfil');
      }
    };

    checkProfile();
  }, [user, router]);

  useEffect(() => {
    const loadRequests = async () => {
      if (!hasProfile) return;

      try {
        setLoading(true);
        const data = await searchJobRequests({
          oficio: oficioFilter || undefined,
          zone: zoneFilter || undefined,
          status: 'open',
        });
        setRequests(data);
      } catch (error) {
        console.error('Error loading requests:', error);
        toast.error('Error al cargar pedidos');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [hasProfile, oficioFilter, zoneFilter]);

  if (authLoading || !user || !hasProfile) {
    return <Loading />;
  }

  return (
    <Layout title="Pedidos disponibles">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-wrap flex-1 w-full sm:w-auto">
            <Select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={[{ value: '', label: 'Todas las categorías' }, ...TRADE_CATEGORIES]}
              className="flex-1 min-w-[150px]"
            />
            <Select
              value={oficioFilter}
              onChange={(e) => setOficioFilter(e.target.value as Oficio | '')}
              options={[{ value: '', label: 'Todos los oficios' }, ...availableSubtrades]}
              className="flex-1 min-w-[150px]"
              disabled={!categoryFilter}
            />
            <Select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value as Zone | '')}
              options={[{ value: '', label: 'Todas las zonas' }, ...ZONES]}
              className="flex-1 min-w-[150px]"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/worker/profile')}
          >
            <Settings size={16} className="mr-1" />
            Mi perfil
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={48} />}
            title="No hay pedidos disponibles"
            description="No encontramos pedidos que coincidan con tus filtros. Probá cambiando los criterios de búsqueda."
          />
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <JobRequestCard
                key={request.id}
                request={request}
                onClick={() => router.push(`/worker/requests/${request.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
