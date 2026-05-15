import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    minLength: 10,
    description: 'Refresh token entregado por el backend al iniciar sesión.',
  })
  @IsString()
  @MinLength(10)
  refreshToken: string;
}