import { PrismaClient, Role, PrescriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const patientPassword = await bcrypt.hash('patient123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      passwordHash: adminPassword,
      name: 'Admin Demo',
      role: Role.ADMIN,
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@test.com' },
    update: {},
    create: {
      email: 'doctor@test.com',
      passwordHash: doctorPassword,
      name: 'Dr. Juan Pérez',
      role: Role.DOCTOR,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      passwordHash: patientPassword,
      name: 'Paciente Demo',
      role: Role.PATIENT,
    },
  });

  const patient2User = await prisma.user.upsert({
    where: { email: 'patient2@test.com' },
    update: {},
    create: {
      email: 'patient2@test.com',
      passwordHash: patientPassword,
      name: 'Paciente Dos',
      role: Role.PATIENT,
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialty: 'Medicina General',
    },
  });

  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      birthDate: new Date('1995-01-15'),
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { userId: patient2User.id },
    update: {},
    create: {
      userId: patient2User.id,
      birthDate: new Date('1998-06-20'),
    },
  });

  const existingPrescription1 = await prisma.prescription.findUnique({
    where: { code: 'RX-DEMO-001' },
  });

  if (!existingPrescription1) {
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
              name: 'Paracetamol',
              dosage: '500 mg',
              quantity: '10 tabletas',
              instructions: 'Tomar cada 8 horas por 3 días.',
            },
            {
              name: 'Ibuprofeno',
              dosage: '400 mg',
              quantity: '6 tabletas',
              instructions: 'Tomar solo si hay dolor o inflamación.',
            },
          ],
        },
      },
    });
  }

  const existingPrescription2 = await prisma.prescription.findUnique({
    where: { code: 'RX-DEMO-002' },
  });

  if (!existingPrescription2) {
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
              name: 'Loratadina',
              dosage: '10 mg',
              quantity: '5 tabletas',
              instructions: 'Tomar una vez al día.',
            },
          ],
        },
      },
    });
  }

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