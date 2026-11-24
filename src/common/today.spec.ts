import { fechaDeHoy } from './today.js';

describe('fechaDeHoy', () => {
  it('usa el día de Tucumán y no el de UTC', () => {
    // 23:30 del día 23 en Tucumán ya es 02:30 del día 24 en UTC.
    expect(fechaDeHoy(new Date('2026-11-24T02:30:00Z'))).toBe('2026-11-23');
  });

  it('cambia de día a la medianoche de Tucumán', () => {
    expect(fechaDeHoy(new Date('2026-11-24T03:00:00Z'))).toBe('2026-11-24');
  });

  it('respeta el fin de febrero', () => {
    expect(fechaDeHoy(new Date('2026-03-01T02:59:59Z'))).toBe('2026-02-28');
  });

  it('devuelve el formato AAAA-MM-DD', () => {
    expect(fechaDeHoy()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});