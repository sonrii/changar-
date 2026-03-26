'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Select } from '@/components/ui/Select';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { WorkerCard } from '@/components/WorkerCard';
import { searchWorkers } from '@/services/worker.service';
import { TRADE_CATEGORIES, ZONES, getSubtradesForCategory } from '@/lib/constants';
import { WorkerProfileWithUser, Oficio, Zone, TradeCategory } from '@/types';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BrowseWorkersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workers, setWorkers] = useState<WorkerProfileWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<TradeCategory | ''>('');
  const [oficioFilter, setOficioFilter] = useState<Oficio | ''>('');
  const [zoneFilter, setZoneFilter] = useState<Zone | ''>('');
  const [availableFilter, setAvailableFilter] = useState<string>('');

  // Get available subtrades based on selected category
  const availableSubtrades = categoryFilter ? getSubtradesForCategory(categoryFilter) : [];

  // Handle category change - reset subtrade
  const handleCategoryChange = (newCategory: string) => {
    setCategoryFilter(newCategory as TradeCategory);
    setOficioFilter(''); // Reset subtrade when category changes
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && user.role !== 'client') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setLoading(true);
        console.log('[BrowseWorkers] Loading workers with filters:', { categoryFilter, oficioFilter, zoneFilter, availableFilter });
        const data = await searchWorkers({
          oficio: oficioFilter || undefined,
          zone: zoneFilter || undefined,
          availableNow: availableFilter === 'true' ? true : undefined,
        });
        console.log('[BrowseWorkers] Loaded', data.length, 'workers');
        setWorkers(data);
      } catch (error) {
        console.error('[BrowseWorkers] Error loading workers:', error);
        toast.error('Error al cargar trabajadores');
      } finally {
        setLoading(false);
      }
    };

    loadWorkers();
  }, [categoryFilter, oficioFilter, zoneFilter, availableFilter]);

  if (authLoading || !user) {
    return <Loading />;
  }

  return (
    <Layout title="Buscar trabajadores">
      <div className="space-y-6">
        <div className="flex gap-3 flex-wrap">
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
          <Select
            value={availableFilter}
            onChange={(e) => setAvailableFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos' },
              { value: 'true', label: 'Disponibles ahora' },
            ]}
            className="flex-1 min-w-[150px]"
          />
        </div>

        {loading ? (
          <Loading />
        ) : workers.length === 0 ? (
          <EmptyState
            icon={<Users size={48} />}
            title="No encontramos trabajadores"
            description="No hay trabajadores que coincidan con tus filtros. Probá cambiando los criterios de búsqueda."
          />
        ) : (
          <div className="grid gap-4">
            {workers.map((worker) => (
              <WorkerCard key={worker.uid} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
