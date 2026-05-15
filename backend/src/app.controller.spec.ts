import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getApiInfo', () => {
    it('should return api information', () => {
      const response = appController.getApiInfo();

      expect(response).toMatchObject({
        name: 'Prescripciones Médicas MVP API',
        status: 'ok',
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
      });

      expect(typeof response.timestamp).toBe('string');
      expect(typeof response.version).toBe('string');
      expect(typeof response.environment).toBe('string');
    });
  });
});