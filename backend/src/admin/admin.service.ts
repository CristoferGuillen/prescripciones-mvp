import { Injectable } from '@nestjs/common';
import { PrescriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const [
      totalDoctors,
      totalPatients,
      totalPrescriptions,
      pendingPrescriptions,
      consumedPrescriptions,
      prescriptionsForDailyMetrics,
    ] = await this.prisma.$transaction([
      this.prisma.doctor.count(),
      this.prisma.patient.count(),
      this.prisma.prescription.count(),
      this.prisma.prescription.count({
        where: {
          status: PrescriptionStatus.PENDING,
        },
      }),
      this.prisma.prescription.count({
        where: {
          status: PrescriptionStatus.CONSUMED,
        },
      }),
      this.prisma.prescription.findMany({
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    return {
      totals: {
        doctors: totalDoctors,
        patients: totalPatients,
        prescriptions: totalPrescriptions,
      },
      byStatus: {
        pending: pendingPrescriptions,
        consumed: consumedPrescriptions,
      },
      byDay: this.groupPrescriptionsByDay(prescriptionsForDailyMetrics),
    };
  }

  private groupPrescriptionsByDay(prescriptions: { createdAt: Date }[]) {
    const grouped = prescriptions.reduce<Record<string, number>>((accumulator, prescription) => {
      const day = prescription.createdAt.toISOString().slice(0, 10);

      accumulator[day] = (accumulator[day] ?? 0) + 1;

      return accumulator;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  }
}