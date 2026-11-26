import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UploadsService } from './uploads.service.js';
import { DeleteUploadParamsDto } from './dto/delete-upload-params.dto.js';
import {
  PATRON_TIPO_PERMITIDO,
  TAMANO_MAXIMO_EN_BYTES,
  type FotoSubida,
} from './rules/upload-rules.js';

// Tope de memoria: Multer corta antes de leer archivos gigantes.
const LIMITE_DE_LECTURA_EN_BYTES = 10 * 1024 * 1024;

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: LIMITE_DE_LECTURA_EN_BYTES },
    }),
  )
  upload(
    @UploadedFile(
      new ParseFilePipe({
        // Si falta la foto lo controlamos abajo, con un mensaje en español.
        fileIsRequired: false,
        validators: [
          // El validador exige "menor que": con + 1 se aceptan exactamente 5 MB.
          new MaxFileSizeValidator({
            maxSize: TAMANO_MAXIMO_EN_BYTES + 1,
            message: 'La foto no puede superar los 5 MB',
          }),
          new FileTypeValidator({
            fileType: PATRON_TIPO_PERMITIDO,
            overrideMimeType: true,
            errorMessage: 'La foto debe ser JPG, PNG o WebP',
          }),
        ],
      }),
    )
    archivo: FotoSubida | undefined,
  ) {
    if (!archivo) {
      throw new BadRequestException('Falta la foto en el campo "file"');
    }
    return this.uploadsService.upload(archivo);
  }

  @Delete(':filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: DeleteUploadParamsDto) {
    return this.uploadsService.remove(params.filename);
  }
}