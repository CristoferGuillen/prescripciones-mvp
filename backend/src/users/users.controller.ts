import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from './users.service';

@ApiTags('Usuarios')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({
    summary: 'Listar usuarios',
    description:
      'Permite consultar usuarios del sistema. Es útil para que el médico seleccione pacientes al crear una prescripción.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: Role,
    description:
      'Filtro opcional por rol. Ejemplo: PATIENT para listar pacientes disponibles.',
  })
  @ApiOkResponse({
    description: 'Usuarios obtenidos correctamente.',
    schema: {
      example: [
        {
          id: 'user-id',
          email: 'patient@test.com',
          name: 'Paciente Demo',
          role: 'PATIENT',
          doctor: null,
          patient: {
            id: 'patient-profile-id',
            birthDate: '1995-01-01T00:00:00.000Z',
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El rol autenticado no tiene permiso para listar usuarios.',
  })
  findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }
}