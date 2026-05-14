import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
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
  findAll(@CurrentUser() currentUser: AuthUser) {
    return this.prescriptionsService.findAll(currentUser);
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