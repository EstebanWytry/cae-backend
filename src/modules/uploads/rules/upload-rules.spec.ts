import {
  PATRON_NOMBRE_ARCHIVO,
  PATRON_TIPO_PERMITIDO,
  armarNombreDeArchivo,
  extensionPara,
  nombreDesdeUrl,
} from './upload-rules.js';

const ID = '3f2b8c1e-9d4a-4b7e-8a6f-1c2d3e4f5a6b';
const BASE = 'https://abcdefgh.supabase.co/storage/v1/object/public/news-images';

describe('extensionPara', () => {
  it('devuelve la extensión de cada tipo permitido', () => {
    expect(extensionPara('image/jpeg')).toBe('jpg');
    expect(extensionPara('image/png')).toBe('png');
    expect(extensionPara('image/webp')).toBe('webp');
  });

  it('devuelve null para tipos no permitidos', () => {
    expect(extensionPara('image/gif')).toBeNull();
    expect(extensionPara('application/pdf')).toBeNull();
  });
});

describe('PATRON_TIPO_PERMITIDO', () => {
  it('acepta JPG, PNG y WebP', () => {
    expect(PATRON_TIPO_PERMITIDO.test('image/jpeg')).toBe(true);
    expect(PATRON_TIPO_PERMITIDO.test('image/png')).toBe(true);
    expect(PATRON_TIPO_PERMITIDO.test('image/webp')).toBe(true);
  });

  it('rechaza otros tipos', () => {
    expect(PATRON_TIPO_PERMITIDO.test('image/gif')).toBe(false);
    expect(PATRON_TIPO_PERMITIDO.test('image/svg+xml')).toBe(false);
  });
});

describe('armarNombreDeArchivo', () => {
  it('arma el nombre con el id y la extensión del tipo', () => {
    expect(armarNombreDeArchivo('image/png', ID)).toBe(`${ID}.png`);
  });

  it('falla si el tipo no está permitido', () => {
    expect(() => armarNombreDeArchivo('image/gif', ID)).toThrow();
  });
});

describe('PATRON_NOMBRE_ARCHIVO', () => {
  it('acepta un nombre generado por el servidor', () => {
    expect(PATRON_NOMBRE_ARCHIVO.test(`${ID}.webp`)).toBe(true);
  });

  it('rechaza intentos de salir de la carpeta', () => {
    expect(PATRON_NOMBRE_ARCHIVO.test('../package.json')).toBe(false);
    expect(PATRON_NOMBRE_ARCHIVO.test(`../${ID}.png`)).toBe(false);
    expect(PATRON_NOMBRE_ARCHIVO.test(`a/${ID}.png`)).toBe(false);
  });

  it('rechaza extensiones no permitidas y nombres libres', () => {
    expect(PATRON_NOMBRE_ARCHIVO.test(`${ID}.gif`)).toBe(false);
    expect(PATRON_NOMBRE_ARCHIVO.test('foto.png')).toBe(false);
  });
});

describe('nombreDesdeUrl', () => {
  it('saca el nombre de una URL pública de Supabase', () => {
    expect(nombreDesdeUrl(`${BASE}/${ID}.jpg`)).toBe(`${ID}.jpg`);
  });

  it('ignora lo que venga después de un signo de pregunta', () => {
    expect(nombreDesdeUrl(`${BASE}/${ID}.jpg?v=2`)).toBe(`${ID}.jpg`);
  });

  it('devuelve null si la URL no es del bucket de fotos', () => {
    expect(nombreDesdeUrl(`https://otro-sitio.com/fotos/${ID}.jpg`)).toBeNull();
  });

  it('devuelve null si el nombre no tiene el formato esperado', () => {
    expect(nombreDesdeUrl(`${BASE}/foto.jpg`)).toBeNull();
    expect(nombreDesdeUrl(`${BASE}/carpeta/${ID}.jpg`)).toBeNull();
  });
});