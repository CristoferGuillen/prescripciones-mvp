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
      'Valida las credenciales del usuario, devuelve access token, refresh token y guarda el refresh token de forma segura en base de datos.',
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
    summary: 'Rotar refresh token y renovar access token',
    description:
      'Recibe un refresh token válido, revoca el refresh token anterior y devuelve un nuevo access token junto con un nuevo refresh token.',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiOkResponse({
    description: 'Tokens renovados correctamente.',
    schema: {
      example: {
        accessToken: 'new.access.jwt.token',
        refreshToken: 'new.refresh.jwt.token',
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
    description: 'Refresh token inválido, expirado o revocado.',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Demasiadas solicitudes de renovación de token. Intenta nuevamente más tarde.',
  })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @Post('logout')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Revoca el refresh token enviado en el cuerpo de la solicitud. Después del logout, ese refresh token no puede volver a usarse.',
  })
  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiOkResponse({
    description: 'Sesión cerrada correctamente.',
    schema: {
      example: {
        message: 'Sesión cerrada correctamente',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido, expirado o revocado.',
  })
  @ApiTooManyRequestsResponse({
    description: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  })
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
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