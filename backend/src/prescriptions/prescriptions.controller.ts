import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PrescriptionStatus, Role } from '@prisma/client';
import type { Response } from 'express';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user.type';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';

@ApiTags('Prescripciones')
@ApiBearerAuth('access-token')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({
    summary: 'Crear una prescripción médica',
    description:
      'Permite crear una prescripción para un paciente. El médico crea con su propio perfil; el admin puede crear usando el primer médico disponible.',
  })
  @ApiBody({
    type: CreatePrescriptionDto,
  })
  @ApiOkResponse({
    description: 'Prescripción creada correctamente.',
    schema: {
      example: {
        id: 'prescription-id',
        code: 'RX-LABC1234-ABCD',
        status: 'PENDING',
        notes: 'Paciente presenta síntomas leves. Control en 5 días.',
        doctorId: 'doctor-profile-id',
        patientId: 'patient-profile-id',
        createdAt: '2026-05-14T00:00:00.000Z',
        updatedAt: '2026-05-14T00:00:00.000Z',
        consumedAt: null,
        items: [
          {
            id: 'item-id',
            medicineName: 'Acetaminofén',
            dosage: '500 mg',
            frequency: 'Cada 8 horas',
            duration: '5 días',
            instructions: 'Tomar después de las comidas.',
            prescriptionId: 'prescription-id',
            createdAt: '2026-05-14T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene permiso para crear prescripciones.',
  })
  @ApiNotFoundResponse({
    description: 'Paciente no encontrado.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  })
  create(
    @CurrentUser() currentUser: AuthUser,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(currentUser, createPrescriptionDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @ApiOperation({
    summary: 'Listar prescripciones',
    description:
      'Lista prescripciones según el rol autenticado. Admin ve todas, médico ve sus prescripciones y paciente ve únicamente las suyas.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PrescriptionStatus,
    description: 'Filtra por estado de prescripción.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número de página. Debe ser mayor o igual a 1.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Cantidad de registros por página. Máximo permitido: 50.',
  })
  @ApiOkResponse({
    description: 'Listado de prescripciones obtenido correctamente.',
    schema: {
      example: {
        data: [
          {
            id: 'prescription-id',
            code: 'RX-LABC1234-ABCD',
            status: 'PENDING',
            notes: 'Paciente presenta síntomas leves.',
            createdAt: '2026-05-14T00:00:00.000Z',
            consumedAt: null,
            doctor: {
              id: 'doctor-profile-id',
              specialty: 'Medicina general',
              user: {
                id: 'doctor-user-id',
                name: 'Doctor Demo',
                email: 'doctor@test.com',
              },
            },
            patient: {
              id: 'patient-profile-id',
              birthDate: '1995-01-01T00:00:00.000Z',
              user: {
                id: 'patient-user-id',
                name: 'Paciente Demo',
                email: 'patient@test.com',
              },
            },
            items: [],
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El rol autenticado no tiene acceso al recurso.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  })
  findAll(
    @CurrentUser() currentUser: AuthUser,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prescriptionsService.findAll(currentUser, {
      status,
      page,
      limit,
    });
  }

  @Get(':id/pdf')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Throttle({
    default: {
      ttl: 60_000,
      limit: 20,
    },
  })
  @Header('Content-Type', 'application/pdf')
  @ApiOperation({
    summary: 'Descargar PDF de una prescripción',
    description:
      'Genera y descarga el PDF de la prescripción. El acceso respeta permisos por propietario: admin puede descargar todo, médico solo las suyas y paciente solo las suyas.',
  })
  @ApiParam({
    name: 'id',
    example: 'prescription-id',
    description: 'ID de la prescripción.',
  })
  @ApiOkResponse({
    description: 'PDF generado correctamente.',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene acceso a esta prescripción.',
  })
  @ApiNotFoundResponse({
    description: 'Prescripción no encontrada.',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Demasiadas descargas de PDF. Intenta nuevamente más tarde.',
  })
  async downloadPdf(
    @CurrentUser() currentUser: AuthUser,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const pdfBuffer = await this.prescriptionsService.generatePdf(
      currentUser,
      id,
    );

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="prescripcion-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    response.end(pdfBuffer);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @ApiOperation({
    summary: 'Obtener detalle de una prescripción',
    description:
      'Obtiene el detalle de una prescripción respetando permisos por propietario.',
  })
  @ApiParam({
    name: 'id',
    example: 'prescription-id',
    description: 'ID de la prescripción.',
  })
  @ApiOkResponse({
    description: 'Detalle de prescripción obtenido correctamente.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene acceso a esta prescripción.',
  })
  @ApiNotFoundResponse({
    description: 'Prescripción no encontrada.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  })
  findOne(@CurrentUser() currentUser: AuthUser, @Param('id') id: string) {
    return this.prescriptionsService.findOne(currentUser, id);
  }

  @Patch(':id/consume')
  @Roles(Role.ADMIN, Role.PATIENT)
  @ApiOperation({
    summary: 'Marcar una prescripción como consumida',
    description:
      'Permite marcar una prescripción como consumida. El paciente solo puede consumir prescripciones propias. El admin también puede ejecutar esta acción.',
  })
  @ApiParam({
    name: 'id',
    example: 'prescription-id',
    description: 'ID de la prescripción.',
  })
  @ApiOkResponse({
    description: 'Prescripción marcada como consumida correctamente.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiForbiddenResponse({
    description: 'El usuario no puede consumir esta prescripción.',
  })
  @ApiNotFoundResponse({
    description: 'Prescripción no encontrada.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  })
  consume(@CurrentUser() currentUser: AuthUser, @Param('id') id: string) {
    return this.prescriptionsService.consume(currentUser, id);
  }
}