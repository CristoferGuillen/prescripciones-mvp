'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { apiFetch } from '../../lib/api';
import { clearSession, getSession } from '../../lib/session';
import { getHomePathByRole, getRoleLabel, LOGIN_ROUTE } from '../../lib/routes';
import type { AuthUser, UserRole } from '../../types/auth';
import { Button } from '../ui/Button';

type AppShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  allowedRoles: UserRole[];
};

type NavItem = {
  label: string;
  path: string;
  icon: string;
};

function getNavigationItems(role: UserRole): NavItem[] {
  if (role === 'ADMIN') {
    return [
      {
        label: 'Dashboard',
        path: '/admin',
        icon: '▦',
      },
    ];
  }

  if (role === 'DOCTOR') {
    return [
      {
        label: 'Prescripciones',
        path: '/doctor/prescriptions',
        icon: '▤',
      },
    ];
  }

  return [
    {
      label: 'Mis prescripciones',
      path: '/patient/prescriptions',
      icon: '▤',
    },
  ];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function isNavItemActive(pathname: string, itemPath: string) {
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

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
    // allowedRoles se recibe fijo desde cada pantalla protegida.
    // Se omite como dependencia para evitar revalidaciones innecesarias
    // durante renders visuales del layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleLogout() {
    const session = getSession();

    setIsLoggingOut(true);

    try {
      if (session?.refreshToken) {
        await apiFetch<{ message: string }>('/auth/logout', {
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-800">
            ▤
          </div>
          <p className="text-sm font-medium text-slate-600">
            Validando sesión...
          </p>
        </div>
      </div>
    );
  }

  const navItems = user ? getNavigationItems(user.role) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white/95 px-4 py-5 shadow-sm backdrop-blur lg:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-800 text-lg font-bold text-white shadow-sm">
            ✚
          </div>

          <div>
            <p className="text-lg font-extrabold leading-tight text-blue-900">
              Prescripciones MVP
            </p>
            <p className="text-sm text-slate-500">Portal médico</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const isActive = isNavItemActive(pathname, item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => router.push(item.path)}
                className={[
                  'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition',
                  isActive
                    ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base shadow-sm ring-1 ring-slate-200">
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 pt-4">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">
              {user ? getInitials(user.name) : 'U'}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {user?.name}
              </p>
              <p className="text-xs font-medium text-slate-500">
                {user ? getRoleLabel(user.role) : ''}
              </p>
            </div>
          </div>

          <Button
            fullWidth
            variant="ghost"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
          </Button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {user ? getRoleLabel(user.role) : 'Prescripciones MVP'}
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 lg:text-3xl">
                {title}
              </h1>

              {description ? (
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {user ? (
                <Button
                  variant="secondary"
                  onClick={() => router.push(getHomePathByRole(user.role))}
                >
                  Inicio
                </Button>
              ) : null}

              <Button
                variant="ghost"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
                className="lg:hidden"
              >
                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
              </Button>
            </div>
          </div>

          {user ? (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const isActive = isNavItemActive(pathname, item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => router.push(item.path)}
                    className={[
                      'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
                      isActive
                        ? 'bg-blue-800 text-white'
                        : 'bg-slate-100 text-slate-600',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}