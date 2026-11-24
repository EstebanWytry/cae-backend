import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}