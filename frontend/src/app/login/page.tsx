'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { apiFetch } from '../../lib/api';
import { getHomePathByRole } from '../../lib/routes';
import { getSession, saveSession } from '../../lib/session';
import type { LoginResponse } from '../../types/auth';

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
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

  function fillDemoCredentials(role: 'ADMIN' | 'DOCTOR' | 'PATIENT') {
    if (role === 'ADMIN') {
      setEmail('admin@test.com');
      setPassword('admin123');
      return;
    }

    if (role === 'DOCTOR') {
      setEmail('doctor@test.com');
      setPassword('doctor123');
      return;
    }

    setEmail('patient@test.com');
    setPassword('patient123');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Prescripciones MVP
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-slate-600">
            Accede con uno de los usuarios demo para continuar el flujo del MVP.
          </p>
        </div>

        <Card>
          <CardHeader
            title="Credenciales"
            description="Selecciona un usuario demo o escribe las credenciales manualmente."
          />

          <div className="mb-5 grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => fillDemoCredentials('ADMIN')}>
              Admin
            </Button>
            <Button variant="secondary" onClick={() => fillDemoCredentials('DOCTOR')}>
              Médico
            </Button>
            <Button variant="secondary" onClick={() => fillDemoCredentials('PATIENT')}>
              Paciente
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-slate-500">
          Backend esperado: http://localhost:3001
        </p>
      </div>
    </main>
  );
}