'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { clearSession, getSession } from '../../lib/session';
import { getHomePathByRole, getRoleLabel, LOGIN_ROUTE } from '../../lib/routes';
import type { AuthUser, UserRole } from '../../types/auth';

type AppShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  allowedRoles: UserRole[];
};

export function AppShell({ children, title, description, allowedRoles }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

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

  function handleLogout() {
    clearSession();
    router.replace(LOGIN_ROUTE);
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Validando sesión...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Prescripciones MVP</p>
            <h1 className="text-xl font-bold text-slate-950">{title}</h1>
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {user ? (
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{user.name}</span>
                <span> · {getRoleLabel(user.role)}</span>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => router.push(getHomePathByRole(user.role))}
                  className={[
                    'rounded-xl px-3 py-2 text-sm font-medium transition',
                    pathname === getHomePathByRole(user.role)
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')}
                >
                  Inicio
                </button>
              ) : null}

              <Button variant="secondary" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </main>
  );
}