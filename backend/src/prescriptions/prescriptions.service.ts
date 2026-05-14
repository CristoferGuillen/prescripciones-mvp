import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrescriptionStatus, Role } from '@prisma/client';
import { AuthUser } from '../common/types/auth-user.type';
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

  private generatePrescriptionCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();

    return `RX-${timestamp}-${random}`;
  }
}