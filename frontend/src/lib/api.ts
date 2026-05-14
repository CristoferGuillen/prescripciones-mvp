import { API_URL } from './config';

type ApiFetchOptions = RequestInit & {
  token?: string | null;
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
  const { token, headers, body, ...rest } = options;

  const requestHeaders = new Headers(headers);

  if (body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    body,
    headers: requestHeaders,
  });

  const contentType = response.headers.get('Content-Type') ?? '';
  const isJson = contentType.includes('application/json');

  const responseBody = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = getErrorMessage(responseBody);

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as T;
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