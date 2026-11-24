import { randomUUID } from 'node:crypto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  BUCKET_DE_FOTOS,
  armarNombreDeArchivo,
  nombreDesdeUrl,
  type FotoSubida,
} from './rules/upload-rules.js';

@Injectable()
export class UploadsService {
  private readonly supabase: SupabaseClient;

  constructor(config: ConfigService) {
    this.supabase = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_SECRET_KEY'),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  async upload(archivo: FotoSubida) {
    const nombre = armarNombreDeArchivo(archivo.mimetype, randomUUID());

    const { error } = await this.supabase.storage
      .from(BUCKET_DE_FOTOS)
      .upload(nombre, archivo.buffer, { contentType: archivo.mimetype });

    if (error) {
      throw new InternalServerErrorException('No se pudo guardar la foto');
    }

    const { data } = this.supabase.storage
      .from(BUCKET_DE_FOTOS)
      .getPublicUrl(nombre);

    return { url: data.publicUrl };
  }

  async remove(nombre: string) {
    const borradas = await this.borrarDelBucket(nombre);

    if (borradas === 0) {
      throw new NotFoundException('La foto no existe');
    }
  }

  // Para news: borra la foto vieja a partir de su URL.
  // Si la URL no es de nuestro bucket, no hace nada.
  async removeByUrl(url: string) {
    const nombre = nombreDesdeUrl(url);
    if (nombre) await this.borrarDelBucket(nombre);
  }

  private async borrarDelBucket(nombre: string): Promise<number> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET_DE_FOTOS)
      .remove([nombre]);

    if (error) {
      throw new InternalServerErrorException('No se pudo borrar la foto');
    }

    return data.length;
  }
}