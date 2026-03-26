'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { getJobRequest, updateJobRequest } from '@/services/job.service';
import { getRequestApplications } from '@/services/application.service';
import { getOficioLabel, getZoneLabel, getUrgencyConfig } from '@/lib/constants';
import { formatDate, getWhatsAppLink } from '@/lib/utils';
import { JobRequest, ApplicationWithWorker } from '@/types';
import { MapPin, Clock, Phone, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobRequestDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  const [request, setRequest] = useState<JobRequest | null>(null);
  const [applications, setApplications] = useState<ApplicationWithWorker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && user.role !== 'client') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [requestData, applicationsData] = await Promise.all([
          getJobRequest(requestId),
          getRequestApplications(requestId),
        ]);

        if (!requestData) {
          toast.error('Pedido no encontrado');
          router.push('/client/dashboard');
          return;
        }

        if (requestData.clientUid !== user.uid) {
          toast.error('No tenés permiso para ver este pedido');
          router.push('/client/dashboard');
          return;
        }

        setRequest(requestData);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, requestId, router]);

  const handleCloseRequest = async () => {
    if (!request) return;

    try {
      await updateJobRequest(request.id, { status: 'closed' });
      toast.success('Pedido cerrado');
      setRequest({ ...request, status: 'closed' });
    } catch (error) {
      console.error('Error closing request:', error);
      toast.error('Error al cerrar el pedido');
    }
  };

  const handleContactWorker = (worker: ApplicationWithWorker) => {
    if (worker.workerPhone) {
      const message = `Hola ${worker.workerName}, vi tu postulación para mi pedido "${request?.title}".`;
      window.open(getWhatsAppLink(worker.workerPhone, message), '_blank');
    }
  };

  if (authLoading || loading || !user || !request) {
    return <Loading />;
  }

  const urgencyConfig = getUrgencyConfig(request.urgency);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {request.title}
              </h1>
              <p className="text-lg text-primary-600 font-medium">
                {getOficioLabel(request.oficio)}
              </p>
            </div>
            <Badge className={urgencyConfig.color}>
              {urgencyConfig.label}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{getZoneLabel(request.zone)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Publicado {formatDate(request.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{applications.length} postulaciones</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Contacto</h3>
            <p className="text-gray-700">{request.contactMethod}</p>
          </div>

          <div className="flex gap-3">
            <Badge variant={request.status === 'open' ? 'success' : 'default'}>
              {request.status === 'open' ? 'Abierto' : 'Cerrado'}
            </Badge>
            {request.status === 'open' && (
              <Button variant="outline" size="sm" onClick={handleCloseRequest}>
                Cerrar pedido
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Postulaciones ({applications.length})
          </h2>

          {applications.length === 0 ? (
            <EmptyState
              icon={<Users size={48} />}
              title="No hay postulaciones todavía"
              description="Cuando los trabajadores se postulen, aparecerán acá."
            />
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {app.workerName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getOficioLabel(app.workerOficio)} • {getZoneLabel(app.workerZone)}
                        </p>
                        {app.workerRating > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span>{app.workerRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={
                        app.status === 'accepted' ? 'success' :
                        app.status === 'rejected' ? 'danger' : 'default'
                      }>
                        {app.status === 'pending' && 'Pendiente'}
                        {app.status === 'accepted' && 'Aceptado'}
                        {app.status === 'rejected' && 'Rechazado'}
                      </Badge>
                    </div>

                    {app.message && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Mensaje:</p>
                        <p className="text-sm text-gray-600">{app.message}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Postulado {formatDate(app.createdAt)}
                    </div>

                    {app.workerPhone && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleContactWorker(app)}
                      >
                        <Phone size={14} className="mr-1" />
                        Contactar por WhatsApp
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push('/client/dashboard')}>
            ← Volver a mis pedidos
          </Button>
        </div>
      </div>
    </Layout>
  );
}
