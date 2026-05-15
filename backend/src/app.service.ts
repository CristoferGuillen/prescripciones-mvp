import { Injectable } from '@nestjs/common';

type ApiInfoResponse = {
  name: string;
  status: 'ok';
  version: string;
  environment: string;
  timestamp: string;
  endpoints: {
    health: string;
    auth: {
      login: string;
      refresh: string;
      profile: string;
    };
    users: string;
    prescriptions: string;
    adminMetrics: string;
  };
};

@Injectable()
export class AppService {
  getApiInfo(): ApiInfoResponse {
    return {
      name: 'Prescripciones Médicas MVP API',
      status: 'ok',
      version: process.env.npm_package_version ?? '1.0.0',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
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
    };
  }
}