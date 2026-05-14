import type { Role } from '@prisma/client';

export type AppJwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: Role;
};