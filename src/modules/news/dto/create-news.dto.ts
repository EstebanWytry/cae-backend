import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNewsDto {
  @IsIn(['Básquet', 'Cestoball', 'Club'], {
    message: 'La categoría debe ser Básquet, Cestoball o Club',
  })
  categoria: string;

  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsString({ message: 'El resumen debe ser texto' })
  @IsNotEmpty({ message: 'El resumen es obligatorio' })
  resumen: string;

  @IsOptional()
  @IsString({ message: 'El contenido debe ser texto' })
  contenido?: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser una URL en formato texto' })
  imagen?: string;

  @IsDateString({}, { message: 'La fecha debe tener formato AAAA-MM-DD' })
  fecha: string;
}
