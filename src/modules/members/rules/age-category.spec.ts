import {
  buscarCategoria,
  calcularEdad,
  edadEnElAnio,
} from './age-category.js';

describe('calcularEdad', () => {
  it('no suma el año si todavía no llegó el cumpleaños', () => {
    expect(calcularEdad('2010-05-20', '2026-05-19')).toBe(15);
  });

  it('suma el año el día del cumpleaños', () => {
    expect(calcularEdad('2010-05-20', '2026-05-20')).toBe(16);
  });

  it('cuenta los años completos después del cumpleaños', () => {
    expect(calcularEdad('2010-05-20', '2026-11-23')).toBe(16);
  });
});

describe('edadEnElAnio', () => {
  it('es la edad que cumple en el año, aunque todavía no la haya cumplido', () => {
    expect(edadEnElAnio('2010-12-31', '2026-01-01')).toBe(16);
  });
});

describe('buscarCategoria', () => {
  const categorias = [
    { name: 'Mini U11', min_age: 10, max_age: 11 },
    { name: 'Infantiles U13', min_age: 12, max_age: 13 },
    { name: 'Primera', min_age: 22, max_age: null },
  ];

  it('encuentra la categoría dentro del rango', () => {
    expect(buscarCategoria(10, categorias)?.name).toBe('Mini U11');
    expect(buscarCategoria(13, categorias)?.name).toBe('Infantiles U13');
  });

  it('una categoría sin edad máxima no tiene límite', () => {
    expect(buscarCategoria(40, categorias)?.name).toBe('Primera');
  });

  it('devuelve null si ninguna categoría encaja', () => {
    expect(buscarCategoria(5, categorias)).toBeNull();
  });
});