import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

function parseCorsOrigins(frontendUrl?: string) {
  const defaultOrigins = ['http://localhost:3000'];

  if (!frontendUrl) {
    return defaultOrigins;
  }

  const configuredOrigins = frontendUrl
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...defaultOrigins, ...configuredOrigins];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = Number(configService.get('PORT') ?? 3001);
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  app.use(helmet());

  app.enableCors({
    origin: parseCorsOrigins(frontendUrl),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Prescripciones Médicas MVP API')
    .setDescription(
      'API REST para la gestión de prescripciones médicas con roles ADMIN, DOCTOR y PATIENT. Incluye autenticación JWT, refresh token, control de acceso por rol, prescripciones, consumo, PDF y métricas administrativas.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Ingresa el access token JWT sin escribir la palabra Bearer. Swagger lo agregará automáticamente.',
      },
      'access-token',
    )
    .addTag('Sistema', 'Información general y estado de salud de la API')
    .addTag('Autenticación', 'Login, refresh token y perfil autenticado')
    .addTag('Usuarios', 'Consulta de usuarios por rol')
    .addTag('Prescripciones', 'Creación, consulta, consumo y PDF de prescripciones')
    .addTag('Administración', 'Métricas generales del sistema')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Prescripciones MVP API Docs',
  });

  await app.listen(port, '0.0.0.0');
}

bootstrap();