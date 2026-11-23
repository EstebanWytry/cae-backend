import { calcularEstadoCuota, diasDelMes } from './fee-status.js';

export function sumarUnMes(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number);

  const nuevoAnio = mes === 12 ? anio + 1 : anio;
  const nuevoMes = mes === 12 ? 1 : mes + 1;
  // Si el día no existe en el mes siguiente (31 de enero), se usa el último día.
  const nuevoDia = Math.min(dia, diasDelMes(nuevoAnio, nuevoMes));

  const mm = String(nuevoMes).padStart(2, '0');
  const dd = String(nuevoDia).padStart(2, '0');
  return `${nuevoAnio}-${mm}-${dd}`;
}

export function calcularFechaDePago(
  ultimoPago: string | null,
  hoy: string,
): string | null {
  const estado = calcularEstadoCuota(ultimoPago, hoy);

  if (estado === 'al_dia') return null;

  if (estado === 'pendiente' || estado === 'vencida') {
    // Sin pagos previos el estado es "pendiente", pero no hay fecha a la que sumar.
    return ultimoPago ? sumarUnMes(ultimoPago) : hoy;
  }

  return hoy; // inactivo
}