import { randomUUID } from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { Prisma, type User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import type { AuthUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { AppJwtPayload } from './types/jwt-payload.type';

type SafeUser = Omit<User, 'passwordHash'>;

type RefreshJwtPayload = AppJwtPayload & {
  tokenId: string;
};

type TokenClient = {
  refreshToken: {
    create: Prisma.RefreshTokenDelegate['create'];
  };
};

@Injectable()
export class AuthService {
  private readonly refreshTokenHashRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const tokens = await this.generateAuthTokens(user);

    return {
      ...tokens,
      user: this.toSafeUser(user),
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = await this.verifyRefreshToken(
        refreshTokenDto.refreshToken,
      );

      const storedRefreshToken = await this.prisma.refreshToken.findUnique({
        where: {
          id: payload.tokenId,
        },
        include: {
          user: true,
        },
      });

      if (!storedRefreshToken) {
        throw new UnauthorizedException('Refresh token no encontrado');
      }

      if (storedRefreshToken.userId !== payload.sub) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      if (storedRefreshToken.revokedAt) {
        throw new UnauthorizedException('Refresh token revocado');
      }

      if (storedRefreshToken.expiresAt.getTime() <= Date.now()) {
        throw new UnauthorizedException('Refresh token expirado');
      }

      const tokenMatches = await bcrypt.compare(
        refreshTokenDto.refreshToken,
        storedRefreshToken.tokenHash,
      );

      if (!tokenMatches) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const accessToken = await this.generateAccessToken(
        storedRefreshToken.user,
      );

      const refreshToken = await this.prisma.$transaction(async (tx) => {
        await tx.refreshToken.update({
          where: {
            id: storedRefreshToken.id,
          },
          data: {
            revokedAt: new Date(),
          },
        });

        return this.createRefreshToken(storedRefreshToken.user, tx);
      });

      return {
        accessToken,
        refreshToken,
        user: this.toSafeUser(storedRefreshToken.user),
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = await this.verifyRefreshToken(
        refreshTokenDto.refreshToken,
      );

      await this.prisma.refreshToken.updateMany({
        where: {
          id: payload.tokenId,
          userId: payload.sub,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      return {
        message: 'Sesión cerrada correctamente',
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  profile(user: AuthUser) {
    return user;
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  private async generateAuthTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.createRefreshToken(user),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(user: User) {
    const payload = this.buildJwtPayload(user);

    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.getAccessTokenExpiresIn(),
    });
  }

  private async createRefreshToken(
    user: User,
    client: TokenClient = this.prisma,
  ) {
    const tokenId = randomUUID();
    const payload: RefreshJwtPayload = {
      ...this.buildJwtPayload(user),
      tokenId,
    };

    const expiresIn = this.getRefreshTokenExpiresIn();
    const expiresAt = this.getExpirationDate(expiresIn);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn,
    });

    const tokenHash = await bcrypt.hash(
      refreshToken,
      this.refreshTokenHashRounds,
    );

    await client.refreshToken.create({
      data: {
        id: tokenId,
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return refreshToken;
  }

  private async verifyRefreshToken(refreshToken: string) {
    return this.jwtService.verifyAsync<RefreshJwtPayload>(refreshToken, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });
  }

  private buildJwtPayload(user: User): AppJwtPayload {
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private getAccessTokenExpiresIn(): JwtSignOptions['expiresIn'] {
    return (this.configService.get('JWT_ACCESS_EXPIRES_IN') ??
      '15m') as JwtSignOptions['expiresIn'];
  }

  private getRefreshTokenExpiresIn(): JwtSignOptions['expiresIn'] {
    return (this.configService.get('JWT_REFRESH_EXPIRES_IN') ??
      '7d') as JwtSignOptions['expiresIn'];
  }

  private getExpirationDate(expiresIn: JwtSignOptions['expiresIn']) {
    const durationMs = this.getDurationInMilliseconds(expiresIn);

    return new Date(Date.now() + durationMs);
  }

  private getDurationInMilliseconds(expiresIn: JwtSignOptions['expiresIn']) {
    if (typeof expiresIn === 'number') {
      return expiresIn * 1000;
    }

    const duration = String(expiresIn);
    const match = duration.match(/^(\d+)(s|m|h|d)$/);

    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
  }

  private toSafeUser(user: User): SafeUser {
    const { passwordHash, ...safeUser } = user;

    return safeUser;
  }
}