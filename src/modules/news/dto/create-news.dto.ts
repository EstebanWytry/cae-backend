import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNewsDto {
  @IsIn(['basketball', 'cestoball', 'club'], {
    message: 'La categoría debe ser basketball, cestoball o club',
  })
  category: string;

  @IsString({ message: 'El título debe ser texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString({ message: 'El resumen debe ser texto' })
  @IsNotEmpty({ message: 'El resumen es obligatorio' })
  summary: string;

  @IsOptional()
  @IsString({ message: 'El contenido debe ser texto' })
  content?: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser una URL en formato texto' })
  image?: string;

  @IsDateString({}, { message: 'La fecha debe tener formato AAAA-MM-DD' })
  date: string;
}