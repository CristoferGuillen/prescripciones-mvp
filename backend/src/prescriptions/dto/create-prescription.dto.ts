import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreatePrescriptionItemDto } from './create-prescription-item.dto';

export class CreatePrescriptionDto {
  @ApiProperty({
    example: 'patient-profile-id',
    description:
      'ID del perfil de paciente al que se le asignará la prescripción. No es el ID del usuario, sino el ID del modelo Patient.',
  })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    example: 'Paciente presenta síntomas leves. Control en 5 días.',
    required: false,
    description: 'Notas generales del médico sobre la prescripción.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [CreatePrescriptionItemDto],
    description:
      'Lista de medicamentos o indicaciones manuales incluidas en la prescripción.',
    example: [
      {
        medicineName: 'Acetaminofén',
        dosage: '500 mg',
        frequency: 'Cada 8 horas',
        duration: '5 días',
        instructions: 'Tomar después de las comidas.',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items: CreatePrescriptionItemDto[];
}