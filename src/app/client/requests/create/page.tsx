'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Loading } from '@/components/ui/Loading';
import { createJobRequest } from '@/services/job.service';
import { TRADE_CATEGORIES, SUBTRADES_BY_CATEGORY, ZONES, URGENCIES } from '@/lib/constants';
import { Oficio, Zone, Urgency, TradeCategory } from '@/types';
import toast from 'react-hot-toast';

export default function CreateJobRequestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<TradeCategory | ''>('');
  const [oficio, setOficio] = useState<Oficio | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState<Zone>('CABA');
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [contactMethod, setContactMethod] = useState('');
  const [loading, setLoading] = useState(false);

  // Get available subtrades based on selected category
  // Add empty option as first item so user must explicitly select
  const availableSubtrades = category 
    ? [{ value: '', label: 'Seleccioná un oficio' }, ...SUBTRADES_BY_CATEGORY[category]]
    : [];

  // Handle category change - reset subtrade
  const handleCategoryChange = (newCategory: string) => {
    console.log('[CreateJobRequest] Category changed to:', newCategory);
    setCategory(newCategory as TradeCategory);
    setOficio(''); // Reset subtrade when category changes
    console.log('[CreateJobRequest] Oficio reset to empty');
  };

  // Handle oficio change
  const handleOficioChange = (newOficio: string) => {
    console.log('[CreateJobRequest] Oficio changed to:', newOficio);
    console.log('[CreateJobRequest] Oficio type:', typeof newOficio);
    console.log('[CreateJobRequest] Oficio is empty?', newOficio === '');
    setOficio(newOficio as Oficio);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && user.role !== 'client') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[CreateJobRequest] Form submitted');
    console.log('[CreateJobRequest] Form values:', { category, oficio, title, description, zone, urgency, contactMethod });
    console.log('[CreateJobRequest] Oficio value type:', typeof oficio, 'isEmpty:', oficio === '', 'length:', oficio.length);

    // Validate required fields
    if (!user) {
      console.error('[CreateJobRequest] No user found');
      toast.error('Usuario no autenticado');
      return;
    }

    if (!category) {
      console.error('[CreateJobRequest] Category not selected');
      toast.error('Por favor seleccioná una categoría');
      return;
    }

    if (!oficio) {
      console.error('[CreateJobRequest] Oficio not selected');
      toast.error('Por favor seleccioná un tipo de trabajador');
      return;
    }

    if (!title.trim()) {
      console.error('[CreateJobRequest] Title is empty');
      toast.error('Por favor ingresá un título para el pedido');
      return;
    }

    if (!description.trim()) {
      console.error('[CreateJobRequest] Description is empty');
      toast.error('Por favor describí el trabajo que necesitás');
      return;
    }

    console.log('[CreateJobRequest] Validation passed, creating job request...');
    setLoading(true);

    try {
      console.log('[CreateJobRequest] Calling createJobRequest with:', {
        clientUid: user.uid,
        oficio,
        category,
        title,
        description: description.substring(0, 50) + '...',
        zone,
        urgency,
        contactMethod: contactMethod || user.email,
      });

      const requestId = await createJobRequest({
        clientUid: user.uid,
        oficio: oficio as Oficio,
        category: category as TradeCategory,
        title,
        description,
        zone,
        urgency,
        contactMethod: contactMethod || user.email,
      });

      console.log('[CreateJobRequest] Job request created successfully with ID:', requestId);
      toast.success('Pedido creado correctamente');
      
      console.log('[CreateJobRequest] Redirecting to request details');
      router.push(`/client/requests/${requestId}`);
    } catch (error: any) {
      console.error('[CreateJobRequest] Error creating request:', error);
      console.error('[CreateJobRequest] Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      
      const errorMessage = error.message || 'Error al crear el pedido. Por favor intentá nuevamente.';
      toast.error(errorMessage);
    } finally {
      console.log('[CreateJobRequest] Setting loading to false');
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <Loading />;
  }

  return (
    <Layout title="Publicar pedido">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Categoría"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              options={TRADE_CATEGORIES}
              required
            />

            <Select
              label="¿Qué tipo de trabajador necesitás?"
              value={oficio}
              onChange={(e) => handleOficioChange(e.target.value)}
              options={availableSubtrades}
              required
              disabled={!category}
            />

            <Input
              label="Título del pedido"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Necesito albañil para refacción de baño"
              required
            />

            <Textarea
              label="Descripción del trabajo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describí en detalle qué necesitás..."
              rows={5}
              required
            />

            <Select
              label="Zona"
              value={zone}
              onChange={(e) => setZone(e.target.value as Zone)}
              options={ZONES}
              required
            />

            <Select
              label="Urgencia"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as Urgency)}
              options={URGENCIES}
              required
            />

            <Input
              label="Método de contacto preferido (opcional)"
              type="text"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              placeholder={user.phone || user.email}
            />

            <div className="pt-4 flex gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar pedido'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/client/dashboard')}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
