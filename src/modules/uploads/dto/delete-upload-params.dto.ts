import { Matches } from 'class-validator';
import { PATRON_NOMBRE_ARCHIVO } from '../rules/upload-rules.js';

export class DeleteUploadParamsDto {
  @Matches(PATRON_NOMBRE_ARCHIVO, {
    message: 'El nombre de la foto no es válido',
  })
  filename: string;
}