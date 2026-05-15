'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { apiFetch } from '../../lib/api';
import { getHomePathByRole } from '../../lib/routes';
import { getSession, saveSession } from '../../lib/session';
import type { LoginResponse, UserRole } from '../../types/auth';

type DemoCredential = {
  role: UserRole;
  label: string;
  email: string;
  password: string;
};

const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'ADMIN',
    label: 'Admin',
    email: 'admin@test.com',
    password: 'admin123',
  },
  {
    role: 'DOCTOR',
    label: 'Médico',
    email: 'doctor@test.com',
    password: 'doctor123',
  },
  {
    role: 'PATIENT',
    label: 'Paciente',
    email: 'patient@test.com',
    password: 'patient123',
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('doctor@test.com');
  const [password, setPassword] = useState('doctor123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (session) {
      router.replace(getHomePathByRole(session.user.role));
    }
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        skipAuthRefresh: true,
        body: JSON.stringify({
          email,
          password,
        }),
      });

      saveSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      });

      router.replace(getHomePathByRole(response.user.role));
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo iniciar sesión';

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillDemoCredentials(credential: DemoCredential) {
    setEmail(credential.email);
    setPassword(credential.password);
    setError('');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-800 text-3xl text-white shadow-sm">
            ▤
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-blue-900">
            Prescripciones MVP
          </h1>

          <p className="mt-2 text-base text-slate-600">
            Portal médico de acceso seguro
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">Iniciar sesión</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Accede con un usuario demo para validar el flujo según rol.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2">
            {DEMO_CREDENTIALS.map((credential) => (
              <button
                key={credential.role}
                type="button"
                onClick={() => fillDemoCredentials(credential)}
                className={[
                  'rounded-xl border px-3 py-2 text-xs font-bold transition',
                  email === credential.email
                    ? 'border-blue-200 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {credential.label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                  !
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700">
                    Error de autenticación
                  </p>
                  <p className="mt-1 text-sm leading-6 text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={email}
              leftIcon={<span aria-hidden="true">✉</span>}
              placeholder="doctor@test.com"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={password}
              leftIcon={<span aria-hidden="true">●</span>}
              placeholder="••••••••"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <Button fullWidth type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
              <span aria-hidden="true">→</span>
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Usa las credenciales demo del proyecto. La validación de permisos se
          realiza desde el backend.
        </p>
      </div>
    </main>
  );
}