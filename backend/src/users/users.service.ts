import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(role?: string) {
    const where = this.buildWhere(role);

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        doctor: {
          select: {
            id: true,
            specialty: true,
          },
        },
        patient: {
          select: {
            id: true,
            birthDate: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  private buildWhere(role?: string) {
    if (!role) {
      return undefined;
    }

    const allowedRoles = Object.values(Role);

    if (!allowedRoles.includes(role as Role)) {
      throw new BadRequestException('Rol inválido');
    }

    return {
      role: role as Role,
    };
  }
}