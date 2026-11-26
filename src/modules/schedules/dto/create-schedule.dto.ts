import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Weekday } from '../../../generated/prisma/client.js';

export class CreateScheduleDto {
  @IsInt({ message: 'El deporte debe ser un número entero' })
  @Min(1, { message: 'El deporte no es válido' })
  sport_id: number;

  @IsInt({ message: 'La categoría debe ser un número entero' })
  @Min(1, { message: 'La categoría no es válida' })
  category_id: number;

  @IsEnum(Weekday, { message: 'El día de la semana no es válido' })
  day: Weekday;

  @IsString({ message: 'La hora de inicio debe ser texto' })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'La hora de inicio debe tener el formato HH:mm',
  })
  start_time: string;

  @IsString({ message: 'La hora de finalización debe ser texto' })
  @IsNotEmpty({ message: 'La hora de finalización es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'La hora de finalización debe tener el formato HH:mm',
  })
  end_time: string;
}