import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMemberDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'El documento debe ser texto' })
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  document: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email: string;

  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe tener formato AAAA-MM-DD' },
  )
  birth_date: string;

  @IsArray({ message: 'Los deportes deben ser una lista' })
  @ArrayUnique({ message: 'No se puede repetir un deporte' })
  @IsString({ each: true, message: 'Cada deporte debe ser texto' })
  sports: string[];

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha del pago inicial debe tener formato AAAA-MM-DD' },
  )
  paid_at?: string;
}
