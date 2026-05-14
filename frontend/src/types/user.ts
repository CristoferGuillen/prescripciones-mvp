import type { UserRole } from './auth';

export type UserListItem = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  doctor: {
    id: string;
    specialty?: string | null;
  } | null;
  patient: {
    id: string;
    birthDate?: string | null;
  } | null;
};