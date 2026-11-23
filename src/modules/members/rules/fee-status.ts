export type EstadoCuota = 'al_dia' | 'pendiente' | 'vencida' | 'inactivo';

function partesDeFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return { anio, mes, dia };
}

export function diasDelMes(anio: number, mes: number) {
  // Día 0 del mes siguiente = último día de este mes (mes va de 1 a 12).
  return new Date(anio, mes, 0).getDate();
}

export function mesesTranscurridos(ultimoPago: string, hoy: string): number {
  const pago = partesDeFecha(ultimoPago);
  const actual = partesDeFecha(hoy);

  let meses = (actual.anio - pago.anio) * 12 + (actual.mes - pago.mes);

  // Si el día de pago no existe este mes, el mes se cumple el último día.
  const diaDeCumplimiento = Math.min(
    pago.dia,
    diasDelMes(actual.anio, actual.mes),
  );
  if (actual.dia < diaDeCumplimiento) {
    meses -= 1;
  }

  return Math.max(meses, 0);
}

export function calcularEstadoCuota(
  ultimoPago: string | null,
  hoy: string,
): EstadoCuota {
  if (!ultimoPago) return 'pendiente';

  const meses = mesesTranscurridos(ultimoPago, hoy);
  if (meses === 0) return 'al_dia';
  if (meses === 1) return 'pendiente';
  if (meses === 2) return 'vencida';
  return 'inactivo';
}