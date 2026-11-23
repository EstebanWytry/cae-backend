import { calcularFechaDePago, sumarUnMes } from './payment.js';

describe('sumarUnMes', () => {
  it('suma un mes calendario', () => {
    expect(sumarUnMes('2026-01-15')).toBe('2026-02-15');
  });

  it('si el día no existe, usa el último día del mes siguiente', () => {
    expect(sumarUnMes('2026-01-31')).toBe('2026-02-28');
  });

  it('pasa de diciembre a enero del año siguiente', () => {
    expect(sumarUnMes('2026-12-10')).toBe('2027-01-10');
  });
});

describe('calcularFechaDePago', () => {
  const hoy = '2026-11-23';

  it('sin pagos previos, la fecha es hoy', () => {
    expect(calcularFechaDePago(null, hoy)).toBe('2026-11-23');
  });

  it('si debe 1 mes, suma un mes al último pago', () => {
    expect(calcularFechaDePago('2026-10-10', hoy)).toBe('2026-11-10');
  });

  it('si debe 2 meses, suma un mes al último pago', () => {
    expect(calcularFechaDePago('2026-09-10', hoy)).toBe('2026-10-10');
  });

  it('si está inactivo, la fecha es hoy', () => {
    expect(calcularFechaDePago('2026-08-10', hoy)).toBe('2026-11-23');
  });

  it('si está al día, no corresponde registrar pago', () => {
    expect(calcularFechaDePago('2026-11-10', hoy)).toBeNull();
  });
});