export type CategoriaEdad = {
  id: number;
  name: string;
  min_age: number;
  max_age: number | null;
};

export function calcularEdad(fechaNacimiento: string, hoy: string): number {
  const [anioNac, mesNac, diaNac] = fechaNacimiento.split('-').map(Number);
  const [anioHoy, mesHoy, diaHoy] = hoy.split('-').map(Number);

  let edad = anioHoy - anioNac;

  // Si todavía no llegó su cumpleaños este año, aún no cumplió esa edad.
  const aunNoCumplio =
    mesHoy < mesNac || (mesHoy === mesNac && diaHoy < diaNac);
  if (aunNoCumplio) {
    edad -= 1;
  }

  return edad;
}

export function edadEnElAnio(fechaNacimiento: string, hoy: string): number {
  const anioNac = Number(fechaNacimiento.split('-')[0]);
  const anioHoy = Number(hoy.split('-')[0]);
  return anioHoy - anioNac;
}

export function buscarCategoria(
  edad: number,
  categorias: CategoriaEdad[],
): CategoriaEdad | null {
  const encontrada = categorias.find(
    (categoria) =>
      edad >= categoria.min_age &&
      (categoria.max_age === null || edad <= categoria.max_age),
  );
  return encontrada ?? null;
}