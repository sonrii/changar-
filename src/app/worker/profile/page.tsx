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
import { Badge } from '@/components/ui/Badge';
import { getWorkerProfile, updateWorkerProfile } from '@/services/worker.service';
import { TRADE_CATEGORIES, SUBTRADES_BY_CATEGORY, ZONES, getCategoryForTrade, getOficioLabel, getZoneLabel } from '@/lib/constants';
import { Oficio, Zone, WorkerProfile, TradeCategory } from '@/types';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WorkerProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState<TradeCategory | ''>('');
  const [oficio, setOficio] = useState<Oficio | ''>('');
  const [zone, setZone] = useState<Zone>('CABA');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [availableNow, setAvailableNow] = useState(true);
  const [activeProfile, setActiveProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get available subtrades based on selected category
  const availableSubtrades = category ? SUBTRADES_BY_CATEGORY[category] : [];

  // Handle category change - reset subtrade
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory as TradeCategory);
    setOficio(''); // Reset subtrade when category changes
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && user.role !== 'worker') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const data = await getWorkerProfile(user.uid);
        if (!data) {
          router.push('/worker/profile/create');
          return;
        }
        setProfile(data);
        // Set category from stored value or derive from oficio
        const profileCategory = data.category || getCategoryForTrade(data.oficio);
        setCategory(profileCategory || '');
        setOficio(data.oficio);
        setZone(data.zone);
        setDescription(data.description);
        setWhatsapp(data.whatsapp || '');
        setAvailableNow(data.availableNow);
        setActiveProfile(data.activeProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  const handleSave = async () => {
    if (!user) {
      toast.error('Usuario no autenticado');
      return;
    }

    // Validate required fields
    if (!category) {
      toast.error('Por favor seleccioná una categoría');
      return;
    }

    if (!oficio) {
      toast.error('Por favor seleccioná un oficio');
      return;
    }

    if (!description.trim()) {
      toast.error('Por favor completá la descripción de tus servicios');
      return;
    }

    console.log('[WorkerProfile] Saving profile with:', { category, oficio, zone, description, whatsapp, availableNow, activeProfile });
    setSaving(true);

    try {
      await updateWorkerProfile(user.uid, {
        oficio: oficio as Oficio,
        category: category as TradeCategory,
        zone,
        description,
        whatsapp: whatsapp || undefined,
        availableNow,
        activeProfile,
      });
      console.log('[WorkerProfile] Profile updated successfully');
      toast.success('Perfil actualizado correctamente');
      setEditing(false);
      
      const updatedProfile = await getWorkerProfile(user.uid);
      if (updatedProfile) {
        setProfile(updatedProfile);
        const profileCategory = updatedProfile.category || getCategoryForTrade(updatedProfile.oficio);
        setCategory(profileCategory || '');
      }
    } catch (error: any) {
      console.error('[WorkerProfile] Error updating profile:', error);
      toast.error(error.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !user || !profile) {
    return <Loading />;
  }

  return (
    <Layout title="Mi perfil">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>
              {profile.totalReviews > 0 && (
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span>{profile.ratingAverage.toFixed(1)} ({profile.totalReviews} reseñas)</span>
                </div>
              )}
            </div>
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Editar
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
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

              <div className="space-y-3">
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

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="activeProfile"
                    checked={activeProfile}
                    onChange={(e) => setActiveProfile(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="activeProfile" className="text-sm font-medium text-gray-700">
                    Perfil activo (visible para clientes)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                  fullWidth
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    const profileCategory = profile.category || getCategoryForTrade(profile.oficio);
                    setCategory(profileCategory || '');
                    setOficio(profile.oficio);
                    setZone(profile.zone);
                    setDescription(profile.description);
                    setWhatsapp(profile.whatsapp || '');
                    setAvailableNow(profile.availableNow);
                    setActiveProfile(profile.activeProfile);
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Oficio</label>
                <p className="text-gray-900">{getOficioLabel(profile.oficio)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Zona</label>
                <p className="text-gray-900">{getZoneLabel(profile.zone)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="text-gray-900">{profile.description}</p>
              </div>

              {profile.whatsapp && (
                <div>
                  <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                  <p className="text-gray-900">{profile.whatsapp}</p>
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                {profile.availableNow && <Badge variant="success">Disponible ahora</Badge>}
                {profile.activeProfile ? (
                  <Badge variant="info">Perfil activo</Badge>
                ) : (
                  <Badge variant="default">Perfil inactivo</Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push('/worker/dashboard')}>
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </Layout>
  );
}
