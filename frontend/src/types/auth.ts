export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};