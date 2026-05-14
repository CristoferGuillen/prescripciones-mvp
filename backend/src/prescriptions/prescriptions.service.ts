import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrescriptionStatus, Role } from '@prisma/client';
import PDFDocument from 'pdfkit';
import type { AuthUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

const prescriptionInclude = Prisma.validator<Prisma.PrescriptionInclude>()({
  doctor: {
    select: {
      id: true,
      userId: true,
      specialty: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  patient: {
    select: {
      id: true,
      userId: true,
      birthDate: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  items: {
    orderBy: {
      createdAt: 'asc',
    },
  },
});

type PrescriptionWithRelations = Prisma.PrescriptionGetPayload<{
  include: typeof prescriptionInclude;
}>;

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(currentUser: AuthUser, dto: CreatePrescriptionDto) {
    const doctorId = await this.resolveDoctorIdForCreation(currentUser);

    const patient = await this.prisma.patient.findUnique({
      where: {
        id: dto.patientId,
      },
      select: {
        id: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.prisma.prescription.create({
      data: {
        code: this.generatePrescriptionCode(),
        doctorId,
        patientId: dto.patientId,
        notes: dto.notes,
        items: {
          create: dto.items.map((item) => ({
            medicineName: item.medicineName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          })),
        },
      },
      include: prescriptionInclude,
    });
  }

  async findAll(currentUser: AuthUser) {
    const where = await this.buildWhereByRole(currentUser);

    return this.prisma.prescription.findMany({
      where,
      include: prescriptionInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(currentUser: AuthUser, id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: {
        id,
      },
      include: prescriptionInclude,
    });

    if (!prescription) {
      throw new NotFoundException('Prescripción no encontrada');
    }

    this.ensureCanAccessPrescription(currentUser, prescription);

    return prescription;
  }

  async consume(currentUser: AuthUser, id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: {
        id,
      },
      include: prescriptionInclude,
    });

    if (!prescription) {
      throw new NotFoundException('Prescripción no encontrada');
    }

    this.ensureCanConsumePrescription(currentUser, prescription);

    if (prescription.status === PrescriptionStatus.CONSUMED) {
      throw new BadRequestException('La prescripción ya fue consumida');
    }

    return this.prisma.prescription.update({
      where: {
        id,
      },
      data: {
        status: PrescriptionStatus.CONSUMED,
        consumedAt: new Date(),
      },
      include: prescriptionInclude,
    });
  }

  async generatePdf(currentUser: AuthUser, id: string) {
    const prescription = await this.findOne(currentUser, id);

    return this.createPrescriptionPdfBuffer(prescription);
  }

  private async resolveDoctorIdForCreation(currentUser: AuthUser): Promise<string> {
    if (currentUser.role === Role.DOCTOR) {
      const doctor = await this.prisma.doctor.findUnique({
        where: {
          userId: currentUser.id,
        },
        select: {
          id: true,
        },
      });

      if (!doctor) {
        throw new ForbiddenException('El usuario no tiene perfil de médico');
      }

      return doctor.id;
    }

    if (currentUser.role === Role.ADMIN) {
      const doctor = await this.prisma.doctor.findFirst({
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
        },
      });

      if (!doctor) {
        throw new BadRequestException('No existe un médico disponible para crear la prescripción');
      }

      return doctor.id;
    }

    throw new ForbiddenException('No puede crear prescripciones');
  }

  private async buildWhereByRole(
    currentUser: AuthUser,
  ): Promise<Prisma.PrescriptionWhereInput> {
    if (currentUser.role === Role.ADMIN) {
      return {};
    }

    if (currentUser.role === Role.DOCTOR) {
      return {
        doctor: {
          userId: currentUser.id,
        },
      };
    }

    if (currentUser.role === Role.PATIENT) {
      return {
        patient: {
          userId: currentUser.id,
        },
      };
    }

    throw new ForbiddenException('Rol no permitido');
  }

  private ensureCanAccessPrescription(
    currentUser: AuthUser,
    prescription: PrescriptionWithRelations,
  ) {
    if (currentUser.role === Role.ADMIN) {
      return;
    }

    if (currentUser.role === Role.DOCTOR && prescription.doctor.userId === currentUser.id) {
      return;
    }

    if (currentUser.role === Role.PATIENT && prescription.patient.userId === currentUser.id) {
      return;
    }

    throw new ForbiddenException('No tiene acceso a esta prescripción');
  }

  private ensureCanConsumePrescription(
    currentUser: AuthUser,
    prescription: PrescriptionWithRelations,
  ) {
    if (currentUser.role === Role.ADMIN) {
      return;
    }

    if (currentUser.role === Role.PATIENT && prescription.patient.userId === currentUser.id) {
      return;
    }

    throw new ForbiddenException('No puede consumir esta prescripción');
  }

  private createPrescriptionPdfBuffer(prescription: PrescriptionWithRelations) {
    return new Promise<Buffer>((resolve, reject) => {
      const document = new PDFDocument({
        margin: 50,
        size: 'A4',
      });

      const chunks: Buffer[] = [];

      document.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      document.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      document.on('error', (error) => {
        reject(error);
      });

      document
        .fontSize(20)
        .text('Prescripción médica', {
          align: 'center',
        })
        .moveDown();

      document.fontSize(11).text(`Código: ${prescription.code}`);
      document.text(`ID: ${prescription.id}`);
      document.text(`Fecha de emisión: ${this.formatDate(prescription.createdAt)}`);
      document.text(`Estado: ${prescription.status}`);
      document.text(
        `Fecha de consumo: ${
          prescription.consumedAt ? this.formatDate(prescription.consumedAt) : 'No consumida'
        }`,
      );

      document.moveDown();

      document.fontSize(14).text('Datos del paciente', {
        underline: true,
      });
      document.fontSize(11).text(`Nombre: ${prescription.patient.user.name}`);
      document.text(`Email: ${prescription.patient.user.email}`);
      document.text(
        `Fecha de nacimiento: ${
          prescription.patient.birthDate
            ? this.formatDate(prescription.patient.birthDate)
            : 'No registrada'
        }`,
      );

      document.moveDown();

      document.fontSize(14).text('Datos del médico', {
        underline: true,
      });
      document.fontSize(11).text(`Nombre: ${prescription.doctor.user.name}`);
      document.text(`Email: ${prescription.doctor.user.email}`);
      document.text(`Especialidad: ${prescription.doctor.specialty ?? 'No registrada'}`);

      document.moveDown();

      document.fontSize(14).text('Notas', {
        underline: true,
      });
      document.fontSize(11).text(prescription.notes ?? 'Sin notas registradas.');

      document.moveDown();

      document.fontSize(14).text('Medicamentos', {
        underline: true,
      });

      prescription.items.forEach((item, index) => {
        document.moveDown(0.5);
        document.fontSize(12).text(`${index + 1}. ${item.medicineName}`);
        document.fontSize(11).text(`Dosis: ${item.dosage}`);
        document.text(`Frecuencia: ${item.frequency}`);
        document.text(`Duración: ${item.duration}`);
        document.text(`Instrucciones: ${item.instructions ?? 'Sin instrucciones adicionales.'}`);
      });

      document.moveDown(2);

      document
        .fontSize(9)
        .text(
          'Documento generado automáticamente por el sistema MVP de prescripciones médicas.',
          {
            align: 'center',
          },
        );

      document.end();
    });
  }

  private formatDate(date: Date) {
    return new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private generatePrescriptionCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();

    return `RX-${timestamp}-${random}`;
  }
}