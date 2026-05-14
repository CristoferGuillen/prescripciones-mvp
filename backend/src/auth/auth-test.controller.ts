import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user.type';

@Controller('auth-test')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthTestController {
  @Get('admin-only')
  @Roles(Role.ADMIN)
  adminOnly(@CurrentUser() user: AuthUser) {
    return {
      message: 'Acceso permitido solo para ADMIN',
      user,
    };
  }

  @Get('doctor-only')
  @Roles(Role.DOCTOR)
  doctorOnly(@CurrentUser() user: AuthUser) {
    return {
      message: 'Acceso permitido solo para DOCTOR',
      user,
    };
  }

  @Get('patient-only')
  @Roles(Role.PATIENT)
  patientOnly(@CurrentUser() user: AuthUser) {
    return {
      message: 'Acceso permitido solo para PATIENT',
      user,
    };
  }
}