'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Loading } from '@/components/ui/Loading';
import { getJobRequestWithClient } from '@/services/job.service';
import { createApplication, checkExistingApplication } from '@/services/application.service';
import { getOficioLabel, getZoneLabel, getUrgencyConfig } from '@/lib/constants';
import { formatDate, getWhatsAppLink } from '@/lib/utils';
import { JobRequestWithClient } from '@/types';
import { MapPin, Clock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WorkerJobRequestDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  const [request, setRequest] = useState<JobRequestWithClient | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && user.role !== 'worker') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [requestData, alreadyApplied] = await Promise.all([
          getJobRequestWithClient(requestId),
          checkExistingApplication(requestId, user.uid),
        ]);

        if (!requestData) {
          toast.error('Pedido no encontrado');
          router.push('/worker/dashboard');
          return;
        }

        setRequest(requestData);
        setHasApplied(alreadyApplied);
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

  const handleApply = async () => {
    if (!user || !request) return;

    setApplying(true);
    try {
      await createApplication({
        requestId: request.id,
        workerUid: user.uid,
        message: applicationMessage,
      });
      toast.success('Postulación enviada correctamente');
      setHasApplied(true);
      setShowApplicationForm(false);
      setApplicationMessage('');
    } catch (error: any) {
      console.error('Error applying:', error);
      toast.error(error.message || 'Error al enviar la postulación');
    } finally {
      setApplying(false);
    }
  };

  const handleContactClient = () => {
    if (!request || !request.clientPhone) return;
    const message = `Hola ${request.clientName}, vi tu pedido "${request.title}" en ChangAR.`;
    window.open(getWhatsAppLink(request.clientPhone, message), '_blank');
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

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{getZoneLabel(request.zone)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Publicado {formatDate(request.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{request.clientName}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Descripción del trabajo</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Contacto</h3>
            <p className="text-gray-700">{request.contactMethod}</p>
          </div>

          {request.status === 'open' ? (
            <div className="space-y-3">
              {hasApplied ? (
                <Badge variant="success" className="text-base px-4 py-2">
                  Ya te postulaste a este pedido
                </Badge>
              ) : showApplicationForm ? (
                <div className="space-y-3">
                  <Textarea
                    label="Mensaje para el cliente (opcional)"
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Contale al cliente por qué sos la persona indicada para este trabajo..."
                    rows={4}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={handleApply}
                      disabled={applying}
                      fullWidth
                    >
                      {applying ? 'Enviando...' : 'Enviar postulación'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                      disabled={applying}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={() => setShowApplicationForm(true)}
                    fullWidth
                  >
                    Postularme
                  </Button>
                  {request.clientPhone && (
                    <Button
                      variant="outline"
                      onClick={handleContactClient}
                    >
                      <Phone size={16} className="mr-1" />
                      Contactar
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Badge variant="default" className="text-base px-4 py-2">
              Este pedido está cerrado
            </Badge>
          )}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push('/worker/dashboard')}>
            ← Volver a pedidos disponibles
          </Button>
        </div>
      </div>
    </Layout>
  );
}
