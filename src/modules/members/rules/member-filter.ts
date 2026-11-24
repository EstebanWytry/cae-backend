import type { EstadoCuota } from './fee-status.js';
import type { FichaSocio } from './member-summary.js';

export type FiltrosSocios = {
  search?: string;
  fee_status?: EstadoCuota;
  sport?: string; // slug del deporte
};

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca las tildes
    .replace(/_/g, ' ')
    .toLowerCase()
    .trim();
}

export function filtrarFichas(
  fichas: FichaSocio[],
  filtros: FiltrosSocios,
): FichaSocio[] {
  const busqueda = normalizar(filtros.search ?? '');

  return fichas.filter((ficha) => {
    if (filtros.fee_status && ficha.fee_status !== filtros.fee_status) {
      return false;
    }
    if (
      filtros.sport &&
      !ficha.sports.some((deporte) => deporte.slug === filtros.sport)
    ) {
      return false;
    }
    if (busqueda === '') return true;

    const textos = [
      ficha.name,
      ficha.document,
      ficha.fee_status,
      ...ficha.sports.map((deporte) => deporte.name),
      ...ficha.sports.map((deporte) => deporte.category ?? ''),
    ].map(normalizar);

    const coincideTexto = textos.some((texto) => texto.includes(busqueda));
    const coincideEdad = String(ficha.age) === busqueda;
    return coincideTexto || coincideEdad;
  });
}