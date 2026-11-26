import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsInt({ message: 'El deporte debe ser un número entero' })
  @Min(1, { message: 'El deporte no es válido' })
  sport_id: number;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsInt({ message: 'La edad mínima debe ser un número entero' })
  @Min(0, { message: 'La edad mínima no puede ser negativa' })
  min_age: number;

  @IsOptional()
  @IsInt({ message: 'La edad máxima debe ser un número entero' })
  @Min(0, { message: 'La edad máxima no puede ser negativa' })
  max_age?: number;
}
