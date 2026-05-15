import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'doctor@test.com',
    description: 'Correo electrónico registrado del usuario.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'doctor123',
    minLength: 6,
    description: 'Contraseña del usuario. Debe tener mínimo 6 caracteres.',
  })
  @IsString()
  @MinLength(6)
  password: string;
}