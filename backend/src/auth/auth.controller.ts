import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { AuthUser } from '../common/types/auth-user.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Valida las credenciales del usuario y devuelve access token, refresh token y datos seguros del usuario.',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    description: 'Inicio de sesión exitoso.',
    schema: {
      example: {
        accessToken: 'access.jwt.token',
        refreshToken: 'refresh.jwt.token',
        user: {
          id: 'user-id',
          email: 'doctor@test.com',
          name: 'Doctor Demo',
          role: 'DOCTOR',
          createdAt: '2026-05-14T00:00:00.000Z',
          updatedAt: '2026-05-14T00:00:00.000Z',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas.',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Demasiados intentos de inicio de sesión. Intenta nuevamente más tarde.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Recibe un refresh token válido y devuelve un nuevo access token junto con el usuario autenticado.',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiOkResponse({
    description: 'Token renovado correctamente.',
    schema: {
      example: {
        accessToken: 'new.access.jwt.token',
        user: {
          id: 'user-id',
          email: 'patient@test.com',
          name: 'Paciente Demo',
          role: 'PATIENT',
          createdAt: '2026-05-14T00:00:00.000Z',
          updatedAt: '2026-05-14T00:00:00.000Z',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido o expirado.',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Demasiadas solicitudes de renovación de token. Intenta nuevamente más tarde.',
  })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener perfil autenticado',
    description:
      'Devuelve la información básica del usuario autenticado a partir del access token JWT.',
  })
  @ApiOkResponse({
    description: 'Perfil autenticado obtenido correctamente.',
    schema: {
      example: {
        id: 'user-id',
        email: 'admin@test.com',
        name: 'Admin Demo',
        role: 'ADMIN',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Access token ausente, inválido o expirado.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  })
  profile(@CurrentUser() user: AuthUser) {
    return this.authService.profile(user);
  }
}