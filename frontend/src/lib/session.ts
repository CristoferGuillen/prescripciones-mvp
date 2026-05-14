import type { AuthUser, StoredSession } from '../types/auth';

const SESSION_KEY = 'prescripciones_mvp_session';

export function saveSession(session: StoredSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as StoredSession;
  } catch {
    clearSession();

    return null;
  }
}

export function getAccessToken() {
  return getSession()?.accessToken ?? null;
}

export function getCurrentUser(): AuthUser | null {
  return getSession()?.user ?? null;
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}