import { armarFichaSocio } from './member-summary.js';

const hoy = '2026-11-23';

const basquet = {
  slug: 'basquet',
  name: 'Básquet',
  categories: [
    { name: 'Infantiles U13', min_age: 12, max_age: 13 },
    { name: 'Cadetes U15', min_age: 14, max_age: 15 },
  ],
};

function crearSocio(payments: { paid_at: string }[]) {
  return {
    user_id: 7,
    name: 'Juan Pérez',
    document: '40123456',
    birth_date: '2012-05-20',
    user: { email: 'juan@ejemplo.com' },
    payments,
    sports: [{ sport: basquet }],
  };
}

describe('armarFichaSocio', () => {
  it('arma los datos básicos', () => {
    const ficha = armarFichaSocio(crearSocio([]), hoy);
    expect(ficha.id).toBe(7);
    expect(ficha.name).toBe('Juan Pérez');
    expect(ficha.document).toBe('40123456');
    expect(ficha.email).toBe('juan@ejemplo.com');
  });

  it('usa el pago más reciente para el estado de cuota', () => {
    const ficha = armarFichaSocio(
      crearSocio([{ paid_at: '2026-09-10' }, { paid_at: '2026-10-10' }]),
      hoy,
    );
    expect(ficha.last_payment).toBe('2026-10-10');
    expect(ficha.fee_status).toBe('pendiente');
  });

  it('sin pagos no hay último pago y queda pendiente', () => {
    const ficha = armarFichaSocio(crearSocio([]), hoy);
    expect(ficha.last_payment).toBeNull();
    expect(ficha.fee_status).toBe('pendiente');
  });

  it('calcula la edad real y la categoría por deporte', () => {
    const ficha = armarFichaSocio(crearSocio([]), hoy);
    expect(ficha.age).toBe(14);
    expect(ficha.sports[0].category).toBe('Cadetes U15');
  });

  it('devuelve categoría null si ninguna encaja', () => {
    const socio = {
      ...crearSocio([]),
      sports: [{ sport: { ...basquet, categories: [] } }],
    };
    const ficha = armarFichaSocio(socio, hoy);
    expect(ficha.sports[0].category).toBeNull();
  });
});