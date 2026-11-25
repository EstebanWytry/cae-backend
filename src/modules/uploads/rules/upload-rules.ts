export const BUCKET_DE_FOTOS = 'news-images';
export type FotoSubida = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};
export const TAMANO_MAXIMO_EN_BYTES = 5 * 1024 * 1024;

const EXTENSIONES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

export const PATRON_TIPO_PERMITIDO = /^image\/(jpeg|png|webp)$/;

export const PATRON_NOMBRE_ARCHIVO =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

const PREFIJO_URL_PUBLICA = `/storage/v1/object/public/${BUCKET_DE_FOTOS}/`;

export function extensionPara(tipo: string): string | null {
  return EXTENSIONES[tipo as keyof typeof EXTENSIONES] ?? null;
}

export function armarNombreDeArchivo(tipo: string, id: string): string {
  const extension = extensionPara(tipo);
  if (!extension) throw new Error(`Tipo de archivo no permitido: ${tipo}`);
  return `${id}.${extension}`;
}

export function nombreDesdeUrl(url: string): string | null {
  const posicion = url.indexOf(PREFIJO_URL_PUBLICA);
  if (posicion === -1) return null;

  const nombre = url.slice(posicion + PREFIJO_URL_PUBLICA.length).split('?')[0];
  return PATRON_NOMBRE_ARCHIVO.test(nombre) ? nombre : null;
}