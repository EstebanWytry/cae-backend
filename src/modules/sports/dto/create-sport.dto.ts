import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSportDto {
  @IsString({ message: 'El slug debe ser texto' })
  @IsNotEmpty({ message: 'El slug es obligatorio' })
  slug: string;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser una URL en formato texto' })
  image?: string;
}
