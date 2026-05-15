import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

type HealthCheckResponse = {
  status: 'ok';
  timestamp: string;
  uptime: number;
  services: {
    api: 'ok';
    database: 'ok';
  };
};

type DatabaseHealthResult =
  | {
      status: 'ok';
    }
  | {
      status: 'error';
      message: string;
    };

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthCheckResponse> {
    const database = await this.checkDatabase();

    if (database.status === 'error') {
      throw new ServiceUnavailableException({
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          api: 'ok',
          database: 'error',
        },
        message: database.message,
      });
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        api: 'ok',
        database: 'ok',
      },
    };
  }

  private async checkDatabase(): Promise<DatabaseHealthResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
      };
    } catch (error) {
      return {
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible verificar la conexión con la base de datos',
      };
    }
  }
}