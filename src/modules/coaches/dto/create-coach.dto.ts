import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCoachDto {
  @IsInt({ message: 'El deporte debe ser un número entero' })
  @Min(1, { message: 'El deporte no es válido' })
  sport_id: number;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'El rol debe ser texto' })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  role: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser una URL válida' })
  image?: string;
}
