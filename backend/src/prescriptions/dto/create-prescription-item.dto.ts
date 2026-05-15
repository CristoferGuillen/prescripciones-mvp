import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionItemDto {
  @ApiProperty({
    example: 'Acetaminofén',
    description: 'Nombre del medicamento escrito manualmente por el médico.',
  })
  @IsString()
  @IsNotEmpty()
  medicineName: string;

  @ApiProperty({
    example: '500 mg',
    description: 'Dosis indicada para el medicamento.',
  })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty({
    example: 'Cada 8 horas',
    description: 'Frecuencia con la que debe tomarse el medicamento.',
  })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({
    example: '5 días',
    description: 'Duración total del tratamiento.',
  })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({
    example: 'Tomar después de las comidas.',
    required: false,
    description: 'Instrucciones adicionales para el paciente.',
  })
  @IsString()
  @IsOptional()
  instructions?: string;
}