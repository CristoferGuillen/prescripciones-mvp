import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('Sistema')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener información general de la API',
    description:
      'Devuelve información básica de la API, entorno actual y endpoints principales disponibles.',
  })
  @ApiOkResponse({
    description: 'Información general de la API obtenida correctamente.',
    schema: {
      example: {
        name: 'Prescripciones Médicas MVP API',
        status: 'ok',
        version: '1.0.0',
        environment: 'development',
        timestamp: '2026-05-14T00:00:00.000Z',
        endpoints: {
          health: '/health',
          auth: {
            login: '/auth/login',
            refresh: '/auth/refresh',
            profile: '/auth/profile',
          },
          users: '/users',
          prescriptions: '/prescriptions',
          adminMetrics: '/admin/metrics',
        },
      },
    },
  })
  getApiInfo() {
    return this.appService.getApiInfo();
  }
}