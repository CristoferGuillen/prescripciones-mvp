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

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('Administración')
@ApiBearerAuth('access-token')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Obtener métricas administrativas',
    description:
      'Devuelve totales de médicos, pacientes y prescripciones, además de conteos por estado y agrupación diaria.',
  })
  @ApiOkResponse({
    description: 'Métricas administrativas obtenidas correctamente.',
    schema: {
      example: {
        totals: {
          doctors: 1,
          patients: 2,
          prescriptions: 5,
        },
        byStatus: {
          pending: 3,
          consumed: 2,
        },
        byDay: [
          {
            date: '2026-05-14',
            count: 2,
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'Solo usuarios ADMIN pueden consultar estas métricas.',
  })
  getMetrics() {
    return this.adminService.getMetrics();
  }
}