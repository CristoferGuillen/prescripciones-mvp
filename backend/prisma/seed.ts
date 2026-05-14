import { PrismaClient, PrescriptionStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const patientPassword = await bcrypt.hash('patient123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
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
        in: ['RX-DEMO-001', 'RX-DEMO-002'],
      },
    },
  });

  await prisma.prescription.create({
    data: {
      code: 'RX-DEMO-001',
      status: PrescriptionStatus.PENDING,
      notes: 'Tomar los medicamentos según indicación médica.',
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
      notes: 'Prescripción de ejemplo marcada como consumida.',
      consumedAt: new Date(),
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

  console.log('Seed ejecutado correctamente');
  console.log({
    admin: admin.email,
    doctor: doctorUser.email,
    patient: patientUser.email,
    patient2: patient2User.email,
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