import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('Sistema')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Verificar estado de salud de la API',
    description:
      'Valida que la API esté activa y que exista conexión disponible con la base de datos PostgreSQL mediante Prisma.',
  })
  @ApiOkResponse({
    description: 'La API y la base de datos están disponibles.',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-05-14T00:00:00.000Z',
        uptime: 12.34,
        services: {
          api: 'ok',
          database: 'ok',
        },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'La API está activa, pero la base de datos no responde.',
    schema: {
      example: {
        statusCode: 503,
        message: {
          status: 'error',
          timestamp: '2026-05-14T00:00:00.000Z',
          uptime: 12.34,
          services: {
            api: 'ok',
            database: 'error',
          },
          message: 'No fue posible verificar la conexión con la base de datos',
        },
        error: 'Service Unavailable',
      },
    },
  })
  check() {
    return this.healthService.check();
  }
}