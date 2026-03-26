'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signUp } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Loading } from '@/components/ui/Loading';
import { ZONES } from '@/lib/constants';
import { UserRole } from '@/types';
import { Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const roleParam = searchParams.get('role') as UserRole | null;

  const [role, setRole] = useState<UserRole>(roleParam || 'client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cityRegion, setCityRegion] = useState('CABA');
  const [loading, setLoading] = useState(false);

  // Redirect authenticated users away from registration page
  useEffect(() => {
    console.log('[RegisterPage] Auth state:', { authLoading, user: user ? { uid: user.uid, role: user.role } : null });
    
    if (authLoading) {
      return; // Wait for auth to load
    }
    
    if (user) {
      console.log('[RegisterPage] User already authenticated, redirecting to home');
      router.replace('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (roleParam) {
      setRole(roleParam);
    }
  }, [roleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('[Register] Creating user:', { email, role, cityRegion });
      await signUp(email, password, fullName, role, cityRegion);
      console.log('[Register] User created successfully');
      toast.success('Cuenta creada correctamente');
      
      // Use replace to prevent back button from returning to registration
      if (role === 'worker') {
        console.log('[Register] Redirecting to worker profile creation');
        router.replace('/worker/profile/create');
      } else {
        console.log('[Register] Redirecting to client dashboard');
        router.replace('/client/dashboard');
      }
    } catch (error: any) {
      console.error('[Register] Error:', error);
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return <Loading text="Verificando sesión..." />;
  }

  // Don't render registration form if user is authenticated (will redirect)
  if (user) {
    return <Loading text="Redirigiendo..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Briefcase className="text-primary-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear cuenta
          </h1>
          <p className="text-gray-600">
            Unite a ChangAR
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué querés hacer?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-3 border-2 rounded-lg font-medium transition-colors ${
                    role === 'client'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Contratar
                </button>
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`p-3 border-2 rounded-lg font-medium transition-colors ${
                    role === 'worker'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Trabajar
                </button>
              </div>
            </div>

            <Input
              label="Nombre completo"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez"
              required
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />

            <Select
              label="Zona"
              value={cityRegion}
              onChange={(e) => setCityRegion(e.target.value)}
              options={ZONES}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tenés cuenta?{' '}
              <button
                onClick={() => router.push('/auth/login')}
                className="text-primary-600 font-medium hover:underline"
              >
                Iniciá sesión
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading text="Cargando..." />}>
      <RegisterForm />
    </Suspense>
  );
}
