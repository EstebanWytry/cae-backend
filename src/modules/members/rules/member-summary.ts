import {
  buscarCategoria,
  calcularEdad,
  edadEnElAnio,
  type CategoriaEdad,
} from './age-category.js';
import { calcularEstadoCuota, type EstadoCuota } from './fee-status.js';

export type SocioConDatos = {
  user_id: number;
  name: string;
  document: string;
  birth_date: string;
  user: { email: string };
  payments: { paid_at: string }[];
  sports: {
    sport: { slug: string; name: string; categories: CategoriaEdad[] };
  }[];
};

export type FichaSocio = {
  id: number;
  name: string;
  document: string;
  email: string;
  age: number;
  fee_status: EstadoCuota;
  last_payment: string | null;
  sports: { slug: string; name: string; category: string | null }[];
};

export function armarFichaSocio(socio: SocioConDatos, hoy: string): FichaSocio {
  // Las fechas "AAAA-MM-DD" se ordenan bien como texto; la última es la más reciente.
  const ultimoPago = socio.payments.map((pago) => pago.paid_at).sort().at(-1) ?? null;
  const edadDelAnio = edadEnElAnio(socio.birth_date, hoy);

  return {
    id: socio.user_id,
    name: socio.name,
    document: socio.document,
    email: socio.user.email,
    age: calcularEdad(socio.birth_date, hoy),
    fee_status: calcularEstadoCuota(ultimoPago, hoy),
    last_payment: ultimoPago,
    sports: socio.sports.map(({ sport }) => ({
      slug: sport.slug,
      name: sport.name,
      category: buscarCategoria(edadDelAnio, sport.categories)?.name ?? null,
    })),
  };
}