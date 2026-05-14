export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type StoredSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};