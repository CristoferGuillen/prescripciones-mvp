import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user.type';

@ApiTags('Autenticación')
@ApiBearerAuth('access-token')
@Controller('auth-test')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthTestController {
  @Get('admin-only')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Endpoint de prueba solo para ADMIN',
    description:
      'Permite validar rápidamente que el guard de roles permita únicamente usuarios con rol ADMIN.',
  })
  @ApiOkResponse({
    description: 'Acceso permitido para ADMIN.',
    schema: {
      example: {
        message: 'Acceso permitido solo para ADMIN',
        user: {
          id: 'user-id',
          email: 'admin@test.com',
          name: 'Admin Demo',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol ADMIN.',
  })
  adminOnly(@CurrentUser() user: AuthUser) {
    return {
      message: 'Acceso permitido solo para ADMIN',
      user,
    };
  }

  @Get('doctor-only')
  @Roles(Role.DOCTOR)
  @ApiOperation({
    summary: 'Endpoint de prueba solo para DOCTOR',
    description:
      'Permite validar rápidamente que el guard de roles permita únicamente usuarios con rol DOCTOR.',
  })
  @ApiOkResponse({
    description: 'Acceso permitido para DOCTOR.',
    schema: {
      example: {
        message: 'Acceso permitido solo para DOCTOR',
        user: {
          id: 'user-id',
          email: 'doctor@test.com',
          name: 'Doctor Demo',
          role: 'DOCTOR',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol DOCTOR.',
  })
  doctorOnly(@CurrentUser() user: AuthUser) {
    return {
      message: 'Acceso permitido solo para DOCTOR',
      user,
    };
  }

  @Get('patient-only')
  @Roles(Role.PATIENT)
  @ApiOperation({
    summary: 'Endpoint de prueba solo para PATIENT',
    description:
      'Permite validar rápidamente que el guard de roles permita únicamente usuarios con rol PATIENT.',
  })
  @ApiOkResponse({
    description: 'Acceso permitido para PATIENT.',
    schema: {
      example: {
        message: 'Acceso permitido solo para PATIENT',
        user: {
          id: 'user-id',
          email: 'patient@test.com',
          name: 'Paciente Demo',
          role: 'PATIENT',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario autenticado no tiene rol PATIENT.',
  })
  patientOnly(@CurrentUser() user: AuthUser) {
    return {
      message: 'Acceso permitido solo para PATIENT',
      user,
    };
  }
}