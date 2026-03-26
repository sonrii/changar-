'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { JobRequestCard } from '@/components/JobRequestCard';
import { getClientJobRequests } from '@/services/job.service';
import { JobRequest } from '@/types';
import { Plus, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[ClientDashboard] Auth state:', { authLoading, user: user ? { uid: user.uid, role: user.role } : null });
    
    if (authLoading) {
      return; // Wait for auth to load
    }
    
    if (!user) {
      console.log('[ClientDashboard] No user, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'client') {
      console.log('[ClientDashboard] User is not a client, redirecting to home');
      router.push('/');
      return;
    }
    
    console.log('[ClientDashboard] User authenticated as client');
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getClientJobRequests(user.uid);
        setRequests(data);
      } catch (error) {
        console.error('Error loading requests:', error);
        toast.error('Error al cargar tus pedidos');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadRequests();
    }
  }, [user]);

  if (authLoading || !user) {
    return <Loading />;
  }

  return (
    <Layout title="Mis pedidos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Gestioná tus pedidos y encontrá trabajadores
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/client/requests/create')}
          >
            <Plus size={16} className="mr-1" />
            Nuevo pedido
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/client/workers')}
            className="h-auto py-4"
          >
            <div className="text-left w-full">
              <div className="font-semibold mb-1">Buscar trabajadores</div>
              <div className="text-sm text-gray-600">
                Explorá perfiles de trabajadores disponibles
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/client/requests/create')}
            className="h-auto py-4"
          >
            <div className="text-left w-full">
              <div className="font-semibold mb-1">Publicar pedido</div>
              <div className="text-sm text-gray-600">
                Dejá que los trabajadores te encuentren
              </div>
            </div>
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tus pedidos
          </h3>
          {loading ? (
            <Loading />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={48} />}
              title="No tenés pedidos publicados"
              description="Creá tu primer pedido para encontrar trabajadores"
              action={{
                label: 'Crear pedido',
                onClick: () => router.push('/client/requests/create'),
              }}
            />
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <JobRequestCard
                  key={request.id}
                  request={{
                    ...request,
                    clientName: user.fullName,
                    clientPhone: user.phone,
                  }}
                  onClick={() => router.push(`/client/requests/${request.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
