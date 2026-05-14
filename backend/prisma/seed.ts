import { PrismaClient, PrescriptionStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const demoPrescriptionCodes = [
  'RX-DEMO-001',
  'RX-DEMO-002',
  'RX-DEMO-003',
  'RX-DEMO-004',
  'RX-DEMO-005',
  'RX-DEMO-006',
];

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const patientPassword = await bcrypt.hash('patient123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      passwordHash: adminPassword,
      name: 'Admin Demo',
      role: Role.ADMIN,
    },
    create: {
      email: 'admin@test.com',
      passwordHash: adminPassword,
      name: 'Admin Demo',
      role: Role.ADMIN,
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@test.com' },
    update: {
      passwordHash: doctorPassword,
      name: 'Dr. Juan Pérez',
      role: Role.DOCTOR,
    },
    create: {
      email: 'doctor@test.com',
      passwordHash: doctorPassword,
      name: 'Dr. Juan Pérez',
      role: Role.DOCTOR,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {
      passwordHash: patientPassword,
      name: 'Paciente Demo',
      role: Role.PATIENT,
    },
    create: {
      email: 'patient@test.com',
      passwordHash: patientPassword,
      name: 'Paciente Demo',
      role: Role.PATIENT,
    },
  });

  const patient2User = await prisma.user.upsert({
    where: { email: 'patient2@test.com' },
    update: {
      passwordHash: patientPassword,
      name: 'Paciente Dos',
      role: Role.PATIENT,
    },
    create: {
      email: 'patient2@test.com',
      passwordHash: patientPassword,
      name: 'Paciente Dos',
      role: Role.PATIENT,
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {
      specialty: 'Medicina General',
    },
    create: {
      userId: doctorUser.id,
      specialty: 'Medicina General',
    },
  });

  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {
      birthDate: new Date('1995-01-15'),
    },
    create: {
      userId: patientUser.id,
      birthDate: new Date('1995-01-15'),
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { userId: patient2User.id },
    update: {
      birthDate: new Date('1998-06-20'),
    },
    create: {
      userId: patient2User.id,
      birthDate: new Date('1998-06-20'),
    },
  });

  await prisma.prescription.deleteMany({
    where: {
      code: {
        in: demoPrescriptionCodes,
      },
    },
  });

  await prisma.prescription.create({
    data: {
      code: 'RX-DEMO-001',
      status: PrescriptionStatus.PENDING,
      notes: 'Tratamiento inicial para dolor y malestar general.',
      createdAt: new Date('2026-05-10T09:00:00.000Z'),
      doctorId: doctor.id,
      patientId: patient.id,
      items: {
        create: [
          {
            medicineName: 'Paracetamol',
            dosage: '500 mg',
            frequency: 'Cada 8 horas',
            duration: '3 días',
            instructions: 'Tomar después de comer.',
          },
          {
            medicineName: 'Ibuprofeno',
            dosage: '400 mg',
            frequency: 'Cada 12 horas',
            duration: '3 días',
            instructions: 'Tomar solo si hay dolor o inflamación.',
          },
        ],
      },
    },
  });

  await prisma.prescription.create({
    data: {
      code: 'RX-DEMO-002',
      status: PrescriptionStatus.CONSUMED,
      notes: 'Tratamiento antialérgico completado.',
      consumedAt: new Date('2026-05-11T18:30:00.000Z'),
      createdAt: new Date('2026-05-11T10:00:00.000Z'),
      doctorId: doctor.id,
      patientId: patient2.id,
      items: {
        create: [
          {
            medicineName: 'Loratadina',
            dosage: '10 mg',
            frequency: 'Una vez al día',
            duration: '5 días',
            instructions: 'Tomar preferiblemente en la noche.',
          },
        ],
      },
    },
  });

  await prisma.prescription.create({
    data: {
      code: 'RX-DEMO-003',
      status: PrescriptionStatus.PENDING,
      notes: 'Control de infección respiratoria leve.',
      createdAt: new Date('2026-05-12T08:45:00.000Z'),
      doctorId: doctor.id,
      patientId: patient.id,
      items: {
        create: [
          {
            medicineName: 'Amoxicilina',
            dosage: '500 mg',
            frequency: 'Cada 8 horas',
            duration: '7 días',
            instructions: 'Completar el tratamiento aunque mejoren los síntomas.',
          },
          {
            medicineName: 'Acetilcisteína',
            dosage: '600 mg',
            frequency: 'Una vez al día',
            duration: '5 días',
            instructions: 'Tomar con abundante agua.',
          },
        ],
      },
    },
  });

  await prisma.prescription.create({
    data: {
      code: 'RX-DEMO-004',
      status: PrescriptionStatus.CONSUMED,
      notes: 'Control gástrico completado satisfactoriamente.',
      consumedAt: new Date('2026-05-12T20:15:00.000Z'),
      createdAt: new Date('2026-05-12T11:30:00.000Z'),
      doctorId: doctor.id,
      patientId: patient.id,
      items: {
        create: [
          {
            medicineName: 'Omeprazol',
            dosage: '20 mg',
            frequency: 'Una vez al día',
            duration: '14 días',
            instructions: 'Tomar en ayunas.',
          },
        ],
      },
    },
  });

  await prisma.prescription.create({
    data: {
      code: 'RX-DEMO-005',
      status: PrescriptionStatus.PENDING,
      notes: 'Seguimiento de congestión nasal y síntomas gripales.',
      createdAt: new Date('2026-05-13T14:20:00.000Z'),
      doctorId: doctor.id,
      patientId: patient2.id,
      items: {
        create: [
          {
            medicineName: 'Cetirizina',
            dosage: '10 mg',
            frequency: 'Una vez al día',
            duration: '5 días',
            instructions: 'Evitar manejar si produce somnolencia.',
          },
          {
            medicineName: 'Solución salina nasal',
            dosage: '2 aplicaciones',
            frequency: 'Cada 6 horas',
            duration: '5 días',
            instructions: 'Aplicar en ambas fosas nasales.',
          },
        ],
      },
    },
  });

  await prisma.prescription.create({
    data: {
      code: 'RX-DEMO-006',
      status: PrescriptionStatus.CONSUMED,
      notes: 'Suplementación indicada en consulta de seguimiento.',
      consumedAt: new Date('2026-05-14T09:10:00.000Z'),
      createdAt: new Date('2026-05-14T08:10:00.000Z'),
      doctorId: doctor.id,
      patientId: patient.id,
      items: {
        create: [
          {
            medicineName: 'Vitamina D',
            dosage: '1000 UI',
            frequency: 'Una vez al día',
            duration: '30 días',
            instructions: 'Tomar junto con alimentos.',
          },
        ],
      },
    },
  });

  console.log('Seed ejecutado correctamente');
  console.log({
    admin: admin.email,
    doctor: doctorUser.email,
    patient: patientUser.email,
    patient2: patient2User.email,
    demoPrescriptions: demoPrescriptionCodes.length,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });