import { calcularEstadoCuota, mesesTranscurridos } from './fee-status.js';

describe('mesesTranscurridos', () => {
  it('no cuenta el mes si falta un día para cumplirse', () => {
    expect(mesesTranscurridos('2026-01-15', '2026-02-14')).toBe(0);
  });

  it('cuenta un mes el mismo día del mes siguiente', () => {
    expect(mesesTranscurridos('2026-01-15', '2026-02-15')).toBe(1);
  });

  it('si pagó el 31, el mes se cumple el último día de febrero', () => {
    expect(mesesTranscurridos('2026-01-31', '2026-02-28')).toBe(1);
    expect(mesesTranscurridos('2026-01-31', '2026-02-27')).toBe(0);
  });

  it('cuenta varios meses', () => {
    expect(mesesTranscurridos('2026-01-15', '2026-04-20')).toBe(3);
  });
});

describe('calcularEstadoCuota', () => {
  const hoy = '2026-11-23';

  it('sin fecha de pago es pendiente', () => {
    expect(calcularEstadoCuota(null, hoy)).toBe('pendiente');
  });

  it('0 meses es al día', () => {
    expect(calcularEstadoCuota('2026-11-10', hoy)).toBe('al_dia');
  });

  it('1 mes es pendiente', () => {
    expect(calcularEstadoCuota('2026-10-10', hoy)).toBe('pendiente');
  });

  it('2 meses es vencida', () => {
    expect(calcularEstadoCuota('2026-09-10', hoy)).toBe('vencida');
  });

  it('3 meses o más es inactivo', () => {
    expect(calcularEstadoCuota('2026-08-10', hoy)).toBe('inactivo');
  });
});