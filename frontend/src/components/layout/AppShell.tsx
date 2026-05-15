'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { apiFetch } from '../../lib/api';
import { clearSession, getSession } from '../../lib/session';
import { getHomePathByRole, getRoleLabel, LOGIN_ROUTE } from '../../lib/routes';
import type { AuthUser, LogoutResponse, UserRole } from '../../types/auth';
import { Button } from '../ui/Button';

type AppShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  allowedRoles: UserRole[];
};

export function AppShell({
  children,
  title,
  description,
  allowedRoles,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace(LOGIN_ROUTE);

      return;
    }

    if (!allowedRoles.includes(session.user.role)) {
      router.replace(getHomePathByRole(session.user.role));

      return;
    }

    setUser(session.user);
    setIsCheckingSession(false);
  }, [allowedRoles, router]);

  async function handleLogout() {
    const session = getSession();

    setIsLoggingOut(true);

    try {
      if (session?.refreshToken) {
        await apiFetch<LogoutResponse>('/auth/logout', {
          method: 'POST',
          skipAuthRefresh: true,
          body: JSON.stringify({
            refreshToken: session.refreshToken,
          }),
        });
      }
    } catch {
      // Aunque falle la revocación remota, se limpia la sesión local.
    } finally {
      clearSession();
      router.replace(LOGIN_ROUTE);
      setIsLoggingOut(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm text-slate-600">
        Validando sesión...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Prescripciones MVP
            </p>
            <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {user ? (
              <p className="text-sm text-slate-600">
                {user.name} · {getRoleLabel(user.role)}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {user ? (
                <Button
                  variant="secondary"
                  onClick={() => router.push(getHomePathByRole(user.role))}
                  className={[
                    'rounded-xl px-3 py-2 text-sm font-medium transition',
                    pathname === getHomePathByRole(user.role)
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')}
                >
                  Inicio
                </Button>
              ) : null}

              <Button
                variant="secondary"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}