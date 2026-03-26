'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Briefcase, Users, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[HomePage] Auth state:', { loading, user: user ? { uid: user.uid, role: user.role } : null });
    
    if (loading) {
      return; // Wait for auth to load
    }
    
    if (user) {
      if (user.role === 'worker') {
        console.log('[HomePage] Redirecting worker to dashboard');
        router.replace('/worker/dashboard');
      } else if (user.role === 'client') {
        console.log('[HomePage] Redirecting client to dashboard');
        router.replace('/client/dashboard');
      }
    } else {
      console.log('[HomePage] No user, showing landing page');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Loading text="Redirigiendo..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Briefcase className="text-primary-600" size={64} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ChangAR
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Laburo rápido, gente real
          </p>
          <p className="text-sm text-gray-500">
            Verificación disponible próximamente
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center mb-4">
              <Users className="text-primary-600" size={48} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Necesito contratar
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Encontrá trabajadores calificados para tu proyecto
            </p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push('/auth/register?role=client')}
            >
              Buscar trabajadores
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-primary-600" size={48} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Quiero trabajar
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Ofrecé tus servicios y conseguí nuevos clientes
            </p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push('/auth/register?role=worker')}
            >
              Crear perfil
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">¿Ya tenés cuenta?</p>
          <Button
            variant="outline"
            onClick={() => router.push('/auth/login')}
          >
            Iniciar sesión
          </Button>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Servicios disponibles
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              Albañil
            </span>
            <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              Plomero
            </span>
            <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              Electricista
            </span>
            <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              Técnico en celulares
            </span>
            <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              Limpieza
            </span>
            <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              Mecánico
            </span>
            <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
              Carpintero
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
