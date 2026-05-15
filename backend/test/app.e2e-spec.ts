import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrescriptionStatus, Role, type User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const TEST_PASSWORD = 'Test123456';

const TEST_EMAILS = {
  admin: 'e2e.admin@test.com',
  doctor: 'e2e.doctor@test.com',
  otherDoctor: 'e2e.other.doctor@test.com',
  patient: 'e2e.patient@test.com',
  otherPatient: 'e2e.other.patient@test.com',
};

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
};

describe('Prescripciones MVP API - e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  let adminSession: LoginResult;
  let doctorSession: LoginResult;
  let otherDoctorSession: LoginResult;
  let patientSession: LoginResult;
  let otherPatientSession: LoginResult;

  let patientProfileId: string;
  let createdPrescriptionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    await cleanTestData();
    await createTestData();

    adminSession = await login(TEST_EMAILS.admin);
    doctorSession = await login(TEST_EMAILS.doctor);
    patientSession = await login(TEST_EMAILS.patient);

    otherDoctorSession = await createAccessOnlySession(TEST_EMAILS.otherDoctor);
    otherPatientSession = await createAccessOnlySession(TEST_EMAILS.otherPatient);
  });

  afterAll(async () => {
    await cleanTestData();
    await app.close();
  });

  describe('Sistema', () => {
    it('debe responder información general de la API en GET /', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);

      expect(response.body).toMatchObject({
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

      expect(response.body.timestamp).toEqual(expect.any(String));
    });

    it('debe responder health check', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        services: {
          api: 'ok',
          database: 'ok',
        },
      });
    });
  });

  describe('Autenticación', () => {
    it('debe iniciar sesión y devolver access token, refresh token y usuario seguro', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_EMAILS.doctor,
          password: TEST_PASSWORD,
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body.accessToken).toEqual(expect.any(String));
      expect(response.body.refreshToken).toEqual(expect.any(String));
      expect(response.body.user).toMatchObject({
        email: TEST_EMAILS.doctor,
        role: Role.DOCTOR,
      });
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('debe rechazar credenciales inválidas', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_EMAILS.doctor,
          password: 'password-incorrecto',
        })
        .expect(401);
    });

    it('debe devolver el perfil autenticado con access token válido', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${doctorSession.accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        email: TEST_EMAILS.doctor,
        role: Role.DOCTOR,
      });
    });

    it('debe rechazar profile sin token', async () => {
      await request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('debe rotar refresh token e impedir reutilizar el anterior', async () => {
      const oldRefreshToken = doctorSession.refreshToken;

      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: oldRefreshToken,
        });

      expect([200, 201]).toContain(refreshResponse.status);
      expect(refreshResponse.body.accessToken).toEqual(expect.any(String));
      expect(refreshResponse.body.refreshToken).toEqual(expect.any(String));
      expect(refreshResponse.body.refreshToken).not.toBe(oldRefreshToken);

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: oldRefreshToken,
        })
        .expect(401);

      doctorSession = refreshResponse.body as LoginResult;
    });

    it('debe cerrar sesión y revocar el refresh token actual', async () => {
      const refreshToken = patientSession.refreshToken;

      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .send({
          refreshToken,
        });

      expect([200, 201]).toContain(logoutResponse.status);
      expect(logoutResponse.body).toEqual({
        message: 'Sesión cerrada correctamente',
      });

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken,
        })
        .expect(401);
    });
  });

  describe('Prescripciones', () => {
    it('debe permitir que un médico cree una prescripción con ítems manuales', async () => {
      const response = await request(app.getHttpServer())
        .post('/prescriptions')
        .set('Authorization', `Bearer ${doctorSession.accessToken}`)
        .send({
          patientId: patientProfileId,
          notes: 'Prescripción creada desde prueba e2e.',
          items: [
            {
              medicineName: 'Acetaminofén',
              dosage: '500 mg',
              frequency: 'Cada 8 horas',
              duration: '3 días',
              instructions: 'Tomar después de las comidas.',
            },
            {
              medicineName: 'Suero oral',
              dosage: '1 sobre',
              frequency: 'Cada 12 horas',
              duration: '2 días',
              instructions: 'Disolver en agua potable.',
            },
          ],
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body.status).toBe(PrescriptionStatus.PENDING);
      expect(response.body.patientId).toBe(patientProfileId);

      createdPrescriptionId = response.body.id;
    });

    it('debe listar prescripciones del médico autenticado', async () => {
      const response = await request(app.getHttpServer())
        .get('/prescriptions')
        .set('Authorization', `Bearer ${doctorSession.accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toBeDefined();

      const ids = response.body.data.map(
        (prescription: { id: string }) => prescription.id,
      );

      expect(ids).toContain(createdPrescriptionId);
    });

    it('debe permitir que el paciente dueño vea el detalle de su prescripción', async () => {
      const response = await request(app.getHttpServer())
        .get(`/prescriptions/${createdPrescriptionId}`)
        .set('Authorization', `Bearer ${patientSession.accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdPrescriptionId,
        patientId: patientProfileId,
      });
    });

    it('debe impedir que otro paciente vea una prescripción ajena', async () => {
      await request(app.getHttpServer())
        .get(`/prescriptions/${createdPrescriptionId}`)
        .set('Authorization', `Bearer ${otherPatientSession.accessToken}`)
        .expect(403);
    });

    it('debe impedir que otro médico vea una prescripción que no creó', async () => {
      await request(app.getHttpServer())
        .get(`/prescriptions/${createdPrescriptionId}`)
        .set('Authorization', `Bearer ${otherDoctorSession.accessToken}`)
        .expect(403);
    });

    it('debe permitir descargar PDF al paciente dueño', async () => {
      const response = await request(app.getHttpServer())
        .get(`/prescriptions/${createdPrescriptionId}/pdf`)
        .set('Authorization', `Bearer ${patientSession.accessToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/pdf');
      expect(response.body).toBeDefined();
    });

    it('debe impedir descargar PDF de una prescripción ajena', async () => {
      await request(app.getHttpServer())
        .get(`/prescriptions/${createdPrescriptionId}/pdf`)
        .set('Authorization', `Bearer ${otherPatientSession.accessToken}`)
        .expect(403);
    });

    it('debe permitir que el paciente dueño consuma su prescripción', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/prescriptions/${createdPrescriptionId}/consume`)
        .set('Authorization', `Bearer ${patientSession.accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdPrescriptionId,
        status: PrescriptionStatus.CONSUMED,
      });
      expect(response.body.consumedAt).toBeTruthy();
    });

    it('debe impedir consumir dos veces la misma prescripción', async () => {
      await request(app.getHttpServer())
        .patch(`/prescriptions/${createdPrescriptionId}/consume`)
        .set('Authorization', `Bearer ${patientSession.accessToken}`)
        .expect(400);
    });
  });

  describe('Administración', () => {
    it('debe permitir que admin consulte métricas', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/metrics')
        .set('Authorization', `Bearer ${adminSession.accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });

    it('debe impedir que un médico consulte métricas admin', async () => {
      await request(app.getHttpServer())
        .get('/admin/metrics')
        .set('Authorization', `Bearer ${doctorSession.accessToken}`)
        .expect(403);
    });

    it('debe impedir que un paciente consulte métricas admin', async () => {
      await request(app.getHttpServer())
        .get('/admin/metrics')
        .set('Authorization', `Bearer ${patientSession.accessToken}`)
        .expect(403);
    });
  });

  async function login(email: string): Promise<LoginResult> {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: TEST_PASSWORD,
      });

    expect([200, 201]).toContain(response.status);
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.refreshToken).toEqual(expect.any(String));

    return response.body as LoginResult;
  }

  async function createAccessOnlySession(email: string): Promise<LoginResult> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const accessToken = await signAccessToken(user);

    return {
      accessToken,
      refreshToken: 'not-used-in-this-test',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async function signAccessToken(user: User) {
    return jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      {
        secret: configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN') ?? '15m',
      },
    );
  }

  async function createTestData() {
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

    await prisma.user.create({
      data: {
        email: TEST_EMAILS.admin,
        passwordHash,
        name: 'Admin E2E',
        role: Role.ADMIN,
      },
    });

    await prisma.user.create({
      data: {
        email: TEST_EMAILS.doctor,
        passwordHash,
        name: 'Doctor E2E',
        role: Role.DOCTOR,
        doctor: {
          create: {
            specialty: 'Medicina General',
          },
        },
      },
    });

    await prisma.user.create({
      data: {
        email: TEST_EMAILS.otherDoctor,
        passwordHash,
        name: 'Otro Doctor E2E',
        role: Role.DOCTOR,
        doctor: {
          create: {
            specialty: 'Medicina Interna',
          },
        },
      },
    });

    const patientUser = await prisma.user.create({
      data: {
        email: TEST_EMAILS.patient,
        passwordHash,
        name: 'Paciente E2E',
        role: Role.PATIENT,
        patient: {
          create: {
            birthDate: new Date('1995-01-15T00:00:00.000Z'),
          },
        },
      },
      include: {
        patient: true,
      },
    });

    await prisma.user.create({
      data: {
        email: TEST_EMAILS.otherPatient,
        passwordHash,
        name: 'Otro Paciente E2E',
        role: Role.PATIENT,
        patient: {
          create: {
            birthDate: new Date('1998-06-20T00:00:00.000Z'),
          },
        },
      },
    });

    if (!patientUser.patient) {
      throw new Error('No se pudo crear perfil de paciente e2e');
    }

    patientProfileId = patientUser.patient.id;
  }

  async function cleanTestData() {
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: Object.values(TEST_EMAILS),
        },
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    const userIds = users.map((user) => user.id);

    const doctorIds = users
      .map((user) => user.doctor?.id)
      .filter((id): id is string => Boolean(id));

    const patientIds = users
      .map((user) => user.patient?.id)
      .filter((id): id is string => Boolean(id));

    if (doctorIds.length > 0) {
      await prisma.prescription.deleteMany({
        where: {
          doctorId: {
            in: doctorIds,
          },
        },
      });
    }

    if (patientIds.length > 0) {
      await prisma.prescription.deleteMany({
        where: {
          patientId: {
            in: patientIds,
          },
        },
      });
    }

    if (userIds.length > 0) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      });

      await prisma.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
    }
  }
});