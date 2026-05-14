import type { UserRole } from '../types/auth';

export const LOGIN_ROUTE = '/login';

export function getHomePathByRole(role: UserRole) {
  if (role === 'ADMIN') {
    return '/admin';
  }

  if (role === 'DOCTOR') {
    return '/doctor/prescriptions';
  }

  return '/patient/prescriptions';
}

export function getRoleLabel(role: UserRole) {
  if (role === 'ADMIN') {
    return 'Administrador';
  }

  if (role === 'DOCTOR') {
    return 'Médico';
  }

  return 'Paciente';
}