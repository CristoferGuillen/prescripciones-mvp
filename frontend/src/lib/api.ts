import { API_URL } from './config';
import { clearSession, getSession, saveSession } from './session';
import type { RefreshResponse, StoredSession } from '../types/auth';

type ApiFetchOptions = RequestInit & {
  token?: string | null;
  skipAuthRefresh?: boolean;
};

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { skipAuthRefresh = false } = options;
  const session = getSession();
  const firstToken = options.token ?? session?.accessToken ?? null;

  const response = await executeRequest(path, options, firstToken);

  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    shouldAttemptRefresh(path)
  ) {
    const refreshedSession = await refreshSession();

    if (refreshedSession) {
      const retryResponse = await executeRequest(
        path,
        options,
        refreshedSession.accessToken,
      );

      return parseResponse<T>(retryResponse);
    }
  }

  return parseResponse<T>(response);
}

async function executeRequest(
  path: string,
  options: ApiFetchOptions,
  token: string | null,
) {
  const {
    token: _ignoredToken,
    skipAuthRefresh: _ignoredSkipRefresh,
    headers,
    body,
    ...rest
  } = options;

  const requestHeaders = new Headers(headers);

  if (body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
    ...rest,
    body,
    headers: requestHeaders,
  });
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('Content-Type') ?? '';
  const isJson = contentType.includes('application/json');
  const responseBody = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = getErrorMessage(responseBody);

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as T;
}

async function refreshSession(): Promise<StoredSession | null> {
  const session = getSession();

  if (!session?.refreshToken) {
    clearSession();

    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: session.refreshToken,
    }),
  });

  if (!response.ok) {
    clearSession();

    return null;
  }

  const refreshResponse = (await response.json()) as RefreshResponse;

  const updatedSession: StoredSession = {
    accessToken: refreshResponse.accessToken,
    refreshToken: refreshResponse.refreshToken,
    user: refreshResponse.user,
  };

  saveSession(updatedSession);

  return updatedSession;
}

function shouldAttemptRefresh(path: string) {
  return !['/auth/login', '/auth/refresh', '/auth/logout'].includes(path);
}

function getErrorMessage(body: unknown) {
  if (!body || typeof body !== 'object') {
    return 'Ocurrió un error inesperado';
  }

  const errorBody = body as ApiErrorBody;

  if (Array.isArray(errorBody.message)) {
    return errorBody.message.join(', ');
  }

  if (typeof errorBody.message === 'string') {
    return errorBody.message;
  }

  if (typeof errorBody.error === 'string') {
    return errorBody.error;
  }

  return 'Ocurrió un error inesperado';
}