import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NewsCategory } from '../../../generated/prisma/client.js';

export class CreateNewsDto {
  @IsEnum(NewsCategory, {
    message: 'La categoría debe ser basketball, cestoball o club',
  })
  category: NewsCategory;

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
