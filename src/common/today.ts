const ZONA_HORARIA = 'America/Argentina/Tucuman';

export function fechaDeHoy(ahora: Date = new Date()): string {
  // El formato "en-CA" devuelve la fecha como AAAA-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(
    ahora,
  );
}