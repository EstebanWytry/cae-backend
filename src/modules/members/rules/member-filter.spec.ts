import { filtrarFichas } from './member-filter.js';
import type { FichaSocio } from './member-summary.js';

function ficha(datos: Partial<FichaSocio>): FichaSocio {
  return {
    id: 1,
    name: 'Sin Nombre',
    document: '10000000',
    email: 'a@a.com',
    age: 20,
    fee_status: 'al_dia',
    last_payment: null,
    sports: [],
    ...datos,
  };
}

const fichas = [
  ficha({
    id: 1,
    name: 'Juan Pérez',
    document: '40123456',
    age: 14,
    fee_status: 'pendiente',
    sports: [{ slug: 'basquet', name: 'Básquet', category: 'Cadetes U15' }],
  }),
  ficha({
    id: 2,
    name: 'María López',
    document: '35999888',
    age: 30,
    fee_status: 'al_dia',
    sports: [{ slug: 'cestoball', name: 'Cestoball', category: 'Primera' }],
  }),
  ficha({
    id: 3,
    name: 'Pedro Gómez',
    document: '28111222',
    age: 45,
    fee_status: 'inactivo',
    sports: [
      { slug: 'basquet', name: 'Básquet', category: 'Primera' },
      { slug: 'cestoball', name: 'Cestoball', category: 'Primera' },
    ],
  }),
];

const ids = (lista: FichaSocio[]) => lista.map((f) => f.id);

describe('filtrarFichas', () => {
  it('sin filtros devuelve todos', () => {
    expect(ids(filtrarFichas(fichas, {}))).toEqual([1, 2, 3]);
  });

  it('busca por nombre sin importar tildes ni mayúsculas', () => {
    expect(ids(filtrarFichas(fichas, { search: 'perez' }))).toEqual([1]);
    expect(ids(filtrarFichas(fichas, { search: 'MARIA' }))).toEqual([2]);
  });

  it('busca por documento', () => {
    expect(ids(filtrarFichas(fichas, { search: '3599' }))).toEqual([2]);
  });

  it('busca por deporte', () => {
    expect(ids(filtrarFichas(fichas, { search: 'basquet' }))).toEqual([1, 3]);
  });

  it('busca por categoría', () => {
    expect(ids(filtrarFichas(fichas, { search: 'cadetes' }))).toEqual([1]);
  });

  it('busca por estado de cuota', () => {
    expect(ids(filtrarFichas(fichas, { search: 'al dia' }))).toEqual([2]);
  });

  it('busca por edad exacta', () => {
    expect(ids(filtrarFichas(fichas, { search: '14' }))).toEqual([1]);
  });

  it('filtra por estado de cuota', () => {
    expect(ids(filtrarFichas(fichas, { fee_status: 'inactivo' }))).toEqual([3]);
  });

  it('filtra por deporte', () => {
    expect(ids(filtrarFichas(fichas, { sport: 'cestoball' }))).toEqual([2, 3]);
  });

  it('combina búsqueda y filtros', () => {
    expect(
      ids(filtrarFichas(fichas, { search: 'primera', sport: 'basquet' })),
    ).toEqual([3]);
  });
});