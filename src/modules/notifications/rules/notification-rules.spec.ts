import { calcularEstadoCuota } from '../../members/rules/fee-status.js';
import { type FichaSocio } from '../../members/rules/member-summary.js';
import {
  armarNotificacion,
  armarNotificaciones,
  diasHasta,
} from './notification-rules.js';

describe('diasHasta', () => {
  it('es 0 si es el mismo día', () => {
    expect(diasHasta('2026-11-23', '2026-11-23')).toBe(0);
  });

  it('cuenta los días dentro del mismo mes', () => {
    expect(diasHasta('2026-11-23', '2026-11-30')).toBe(7);
  });

  it('cruza el fin de mes', () => {
    expect(diasHasta('2026-11-28', '2026-12-03')).toBe(5);
  });

  it('cruza el fin de año', () => {
    expect(diasHasta('2026-12-30', '2027-01-02')).toBe(3);
  });

  it('es negativo si la fecha ya pasó', () => {
    expect(diasHasta('2026-11-23', '2026-11-20')).toBe(-3);
  });
});

describe('armarNotificacion', () => {
  const hoy = '2026-11-23';

  function fichaConPago(ultimoPago: string | null): FichaSocio {
    return {
      id: 1,
      name: 'Ana Pérez',
      document: '30111222',
      email: 'ana@test.com',
      age: 20,
      fee_status: calcularEstadoCuota(ultimoPago, hoy),
      last_payment: ultimoPago,
      sports: [],
    };
  }

  it('avisa a quien nunca pagó', () => {
    const aviso = armarNotificacion(fichaConPago(null), hoy);
    expect(aviso?.type).toBe('sin_pagos');
    expect(aviso?.message).toBe('Nunca registró un pago');
    expect(aviso?.due_date).toBeNull();
  });

  it('avisa a quien debe 1 mes', () => {
    const aviso = armarNotificacion(fichaConPago('2026-10-10'), hoy);
    expect(aviso?.type).toBe('pendiente');
    expect(aviso?.message).toBe('Debe 1 mes de cuota');
  });

  it('avisa a quien debe 2 meses', () => {
    const aviso = armarNotificacion(fichaConPago('2026-09-10'), hoy);
    expect(aviso?.type).toBe('vencida');
    expect(aviso?.message).toBe('Debe 2 meses de cuota');
  });

  it('avisa a quien está inactivo', () => {
    const aviso = armarNotificacion(fichaConPago('2026-07-10'), hoy);
    expect(aviso?.type).toBe('inactivo');
  });

  it('avisa por vencer cuando faltan 7 días', () => {
    const aviso = armarNotificacion(fichaConPago('2026-10-30'), hoy);
    expect(aviso?.type).toBe('por_vencer');
    expect(aviso?.message).toBe(
      'Faltan 7 días para que se cumpla el mes de cuota',
    );
    expect(aviso?.due_date).toBe('2026-11-30');
  });

  it('usa el singular cuando falta 1 día', () => {
    const aviso = armarNotificacion(fichaConPago('2026-10-24'), hoy);
    expect(aviso?.type).toBe('por_vencer');
    expect(aviso?.message).toBe(
      'Falta 1 día para que se cumpla el mes de cuota',
    );
  });

  it('no avisa si faltan 8 días o más', () => {
    expect(armarNotificacion(fichaConPago('2026-11-01'), hoy)).toBeNull();
  });

  it('el día que se cumple el mes ya es pendiente, no por vencer', () => {
    const aviso = armarNotificacion(fichaConPago('2026-10-23'), hoy);
    expect(aviso?.type).toBe('pendiente');
  });
});

describe('armarNotificaciones', () => {
  const hoy = '2026-11-23';

  function socio(
    id: number,
    name: string,
    ultimoPago: string | null,
  ): FichaSocio {
    return {
      id,
      name,
      document: `3000000${id}`,
      email: `socio${id}@test.com`,
      age: 20,
      fee_status: calcularEstadoCuota(ultimoPago, hoy),
      last_payment: ultimoPago,
      sports: [],
    };
  }

  // Desordenados a propósito, para comprobar que la función los ordena.
  const fichas = [
    socio(6, 'Lola Sosa', '2026-11-10'), // al día, sin aviso
    socio(5, 'Mario Paz', '2026-10-30'), // por vencer (faltan 7 días)
    socio(4, 'Ana Pérez', null), // nunca pagó
    socio(3, 'Carla Gómez', '2026-10-10'), // debe 1 mes
    socio(2, 'Bruno Díaz', '2026-09-10'), // debe 2 meses
    socio(1, 'Zoe Ruiz', '2026-07-10'), // inactiva
    socio(7, 'Abel Cruz', '2026-10-12'), // debe 1 mes
  ];

  it('ordena por urgencia y, dentro de cada tipo, por nombre', () => {
    const avisos = armarNotificaciones(fichas, hoy);
    expect(avisos.map((aviso) => aviso.type)).toEqual([
      'inactivo',
      'vencida',
      'pendiente',
      'pendiente',
      'sin_pagos',
      'por_vencer',
    ]);
    expect(avisos.map((aviso) => aviso.name)).toEqual([
      'Zoe Ruiz',
      'Bruno Díaz',
      'Abel Cruz',
      'Carla Gómez',
      'Ana Pérez',
      'Mario Paz',
    ]);
  });

  it('no incluye a quien está al día y no vence pronto', () => {
    const avisos = armarNotificaciones(fichas, hoy);
    expect(avisos.some((aviso) => aviso.name === 'Lola Sosa')).toBe(false);
  });

  it('filtra por tipo cuando se indica', () => {
    const avisos = armarNotificaciones(fichas, hoy, 'pendiente');
    expect(avisos.map((aviso) => aviso.name)).toEqual([
      'Abel Cruz',
      'Carla Gómez',
    ]);
  });

  it('devuelve una lista vacía si no hay socios', () => {
    expect(armarNotificaciones([], hoy)).toEqual([]);
  });
});
