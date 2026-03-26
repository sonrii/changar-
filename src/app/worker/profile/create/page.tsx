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
import { createWorkerProfile } from '@/services/worker.service';
import { TRADE_CATEGORIES, SUBTRADES_BY_CATEGORY, ZONES, getCategoryForTrade } from '@/lib/constants';
import { Oficio, Zone, TradeCategory } from '@/types';
import toast from 'react-hot-toast';

export default function CreateWorkerProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<TradeCategory | ''>('');
  const [oficio, setOficio] = useState<Oficio | ''>('');
  const [zone, setZone] = useState<Zone>('CABA');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [availableNow, setAvailableNow] = useState(true);
  const [loading, setLoading] = useState(false);

  // Get available subtrades based on selected category
  const availableSubtrades = category ? SUBTRADES_BY_CATEGORY[category] : [];

  // Handle category change - reset subtrade
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory as TradeCategory);
    setOficio(''); // Reset subtrade when category changes
  };

  useEffect(() => {
    console.log('[CreateWorkerProfile] Auth state:', { authLoading, user: user ? { uid: user.uid, role: user.role } : null });
    
    if (authLoading) {
      return; // Wait for auth to load
    }
    
    if (!user) {
      console.log('[CreateWorkerProfile] No user, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'worker') {
      console.log('[CreateWorkerProfile] User is not a worker, redirecting to home');
      router.push('/');
      return;
    }
    
    console.log('[CreateWorkerProfile] Worker authenticated, showing profile creation form');
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[CreateWorkerProfile] Form submitted');
    console.log('[CreateWorkerProfile] Form values:', { category, oficio, zone, description, whatsapp, availableNow });

    // Validate required fields
    if (!user) {
      console.error('[CreateWorkerProfile] No user found');
      toast.error('Usuario no autenticado');
      return;
    }

    if (!category) {
      console.error('[CreateWorkerProfile] Category not selected');
      toast.error('Por favor seleccioná una categoría');
      return;
    }

    if (!oficio) {
      console.error('[CreateWorkerProfile] Oficio not selected');
      toast.error('Por favor seleccioná un oficio');
      return;
    }

    if (!description.trim()) {
      console.error('[CreateWorkerProfile] Description is empty');
      toast.error('Por favor completá la descripción de tus servicios');
      return;
    }

    console.log('[CreateWorkerProfile] Validation passed, creating profile...');
    setLoading(true);

    try {
      console.log('[CreateWorkerProfile] Calling createWorkerProfile with:', {
        uid: user.uid,
        oficio,
        category,
        zone,
        description: description.substring(0, 50) + '...',
        whatsapp: whatsapp || 'none',
        availableNow,
      });

      await createWorkerProfile({
        uid: user.uid,
        oficio: oficio as Oficio,
        category: category as TradeCategory,
        zone,
        description,
        whatsapp: whatsapp || undefined,
        availableNow,
      });

      console.log('[CreateWorkerProfile] Profile created successfully!');
      toast.success('Perfil creado correctamente');
      
      console.log('[CreateWorkerProfile] Redirecting to /worker/dashboard');
      // Use replace to prevent back button from returning to profile creation
      router.replace('/worker/dashboard');
    } catch (error: any) {
      console.error('[CreateWorkerProfile] Error creating profile:', error);
      console.error('[CreateWorkerProfile] Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Error al crear el perfil. Por favor intentá nuevamente.';
      toast.error(errorMessage);
    } finally {
      console.log('[CreateWorkerProfile] Setting loading to false');
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <Loading />;
  }

  return (
    <Layout title="Crear perfil de trabajador">
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
              label="Oficio"
              value={oficio}
              onChange={(e) => setOficio(e.target.value as Oficio)}
              options={availableSubtrades}
              required
              disabled={!category}
            />

            <Select
              label="Zona de trabajo"
              value={zone}
              onChange={(e) => setZone(e.target.value as Zone)}
              options={ZONES}
              required
            />

            <Textarea
              label="Descripción de tus servicios"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Albañil con 10 años de experiencia en construcción y refacciones..."
              rows={4}
              required
            />

            <Input
              label="WhatsApp (opcional)"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="11 1234-5678"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="availableNow"
                checked={availableNow}
                onChange={(e) => setAvailableNow(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="availableNow" className="text-sm font-medium text-gray-700">
                Estoy disponible ahora para trabajar
              </label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creando perfil...' : 'Crear perfil'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
