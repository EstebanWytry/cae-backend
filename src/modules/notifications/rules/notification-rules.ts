import { type FichaSocio } from '../../members/rules/member-summary.js';
import { sumarUnMes } from '../../members/rules/payment.js';

export const TIPOS_DE_NOTIFICACION = [
  'por_vencer',
  'pendiente',
  'vencida',
  'inactivo',
  'sin_pagos',
] as const;

export type TipoNotificacion = (typeof TIPOS_DE_NOTIFICACION)[number];

export type Notificacion = {
  type: TipoNotificacion;
  member_id: number;
  name: string;
  document: string;
  message: string;
  due_date: string | null;
};

const DIAS_DE_AVISO = 7;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

const MENSAJES_DE_DEUDA = {
  pendiente: 'Debe 1 mes de cuota',
  vencida: 'Debe 2 meses de cuota',
  inactivo: 'Está inactivo: debe 3 meses o más',
} as const;

const ORDEN_DE_URGENCIA: TipoNotificacion[] = [
  'inactivo',
  'vencida',
  'pendiente',
  'sin_pagos',
  'por_vencer',
];

function aMilisegundosUTC(fecha: string): number {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return Date.UTC(anio, mes - 1, dia);
}

export function diasHasta(desde: string, hasta: string): number {
  return (aMilisegundosUTC(hasta) - aMilisegundosUTC(desde)) / MS_POR_DIA;
}

export function armarNotificacion(
  ficha: FichaSocio,
  hoy: string,
): Notificacion | null {
  const base = {
    member_id: ficha.id,
    name: ficha.name,
    document: ficha.document,
    due_date: null,
  };

  // Sin pagos, el estado de cuota figura como "pendiente": hay que mirarlo antes.
  if (ficha.last_payment === null) {
    return { ...base, type: 'sin_pagos', message: 'Nunca registró un pago' };
  }

  if (ficha.fee_status !== 'al_dia') {
    return {
      ...base,
      type: ficha.fee_status,
      message: MENSAJES_DE_DEUDA[ficha.fee_status],
    };
  }

  // Está al día: se avisa si el mes se cumple dentro de los próximos 7 días.
  const vencimiento = sumarUnMes(ficha.last_payment);
  const dias = diasHasta(hoy, vencimiento);
  if (dias < 1 || dias > DIAS_DE_AVISO) return null;

  const faltan = dias === 1 ? 'Falta 1 día' : `Faltan ${dias} días`;
  return {
    ...base,
    type: 'por_vencer',
    message: `${faltan} para que se cumpla el mes de cuota`,
    due_date: vencimiento,
  };
}
export function armarNotificaciones(
  fichas: FichaSocio[],
  hoy: string,
  tipo?: TipoNotificacion,
): Notificacion[] {
  return fichas
    .map((ficha) => armarNotificacion(ficha, hoy))
    .filter((aviso): aviso is Notificacion => aviso !== null)
    .filter((aviso) => !tipo || aviso.type === tipo)
    .sort(
      (a, b) =>
        ORDEN_DE_URGENCIA.indexOf(a.type) - ORDEN_DE_URGENCIA.indexOf(b.type) ||
        a.name.localeCompare(b.name, 'es'),
    );
}
