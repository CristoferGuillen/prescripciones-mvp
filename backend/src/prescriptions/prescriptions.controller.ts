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
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user.type';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR)
  create(
    @CurrentUser() currentUser: AuthUser,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(currentUser, createPrescriptionDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
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
  @Header('Content-Type', 'application/pdf')
  async downloadPdf(
    @CurrentUser() currentUser: AuthUser,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const pdfBuffer = await this.prescriptionsService.generatePdf(currentUser, id);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="prescripcion-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    response.end(pdfBuffer);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  findOne(@CurrentUser() currentUser: AuthUser, @Param('id') id: string) {
    return this.prescriptionsService.findOne(currentUser, id);
  }

  @Patch(':id/consume')
  @Roles(Role.ADMIN, Role.PATIENT)
  consume(@CurrentUser() currentUser: AuthUser, @Param('id') id: string) {
    return this.prescriptionsService.consume(currentUser, id);
  }
}