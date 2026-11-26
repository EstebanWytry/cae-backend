import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';
import { PrismaService } from '../../database/prisma.service.js';
import { hashPassword } from '../../common/password.js';
import { edadEnElAnio, buscarCategoria } from './rules/age-category.js';
import { armarFichaSocio } from './rules/member-summary.js';
import { calcularFechaDePago } from './rules/payment.js';

function formatearFecha(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

function obtenerFechaActual(): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const obtener = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)!.value;

  return `${obtener('year')}-${obtener('month')}-${obtener('day')}`;
}

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    const { name, document, email, birth_date, sports, paid_at } =
      createMemberDto;

    const fechaActual = obtenerFechaActual();
    const edad = edadEnElAnio(birth_date, fechaActual);

    const deportes = await this.prisma.sport.findMany({
      where: { slug: { in: sports } },
      include: { categories: true },
    });

    if (deportes.length !== sports.length) {
      throw new NotFoundException('Uno o más deportes no existen');
    }

    const deportesSocio = deportes.map((deporte) => {
      const categoria = buscarCategoria(edad, deporte.categories);

      if (!categoria) {
        throw new BadRequestException(
          `No hay una categoría disponible para ${deporte.name}`,
        );
      }

      return {
        sport_id: deporte.id,
        category_id: categoria.id,
      };
    });

    const password_hash = await hashPassword(document);

    const socio = await this.prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password_hash,
        member: {
          create: {
            name,
            document,
            birth_date: new Date(`${birth_date}T00:00:00.000Z`),
            sports: {
              create: deportesSocio,
            },
            ...(paid_at && {
              payments: {
                create: {
                  paid_at: new Date(`${paid_at}T00:00:00.000Z`),
                  period_month: Number(paid_at.split('-')[1]),
                  period_year: Number(paid_at.split('-')[0]),
                },
              },
            }),
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        member: {
          select: {
            name: true,
            document: true,
          },
        },
      },
    });

    return {
      id: socio.id,
      name: socio.member!.name,
      document: socio.member!.document,
      email: socio.email,
      role: socio.role,
    };
  }

  async findAll() {
    const socios = await this.prisma.member.findMany({
      orderBy: { name: 'asc' },
      include: {
        user: { select: { email: true } },
        payments: { select: { paid_at: true } },
        sports: {
          include: {
            category: {
              include: {
                sport: {
                  include: { categories: true },
                },
              },
            },
          },
        },
      },
    });

    const hoy = obtenerFechaActual();

    return socios.map((socio) =>
      armarFichaSocio(
        {
          user_id: socio.user_id,
          name: socio.name,
          document: socio.document,
          birth_date: formatearFecha(socio.birth_date),
          user: socio.user,
          payments: socio.payments.map((pago) => ({
            paid_at: formatearFecha(pago.paid_at),
          })),
          sports: socio.sports.map(({ category }) => ({
            sport: {
              slug: category.sport.slug,
              name: category.sport.name,
              categories: category.sport.categories,
            },
          })),
        },
        hoy,
      ),
    );
  }

  async findMe(id: number) {
    return this.findOne(id);
  }

  async findOne(id: number) {
    const socio = await this.prisma.member.findUnique({
      where: { user_id: id },
      include: {
        user: { select: { email: true } },
        payments: { select: { paid_at: true } },
        sports: {
          include: {
            category: {
              include: {
                sport: {
                  include: { categories: true },
                },
              },
            },
          },
        },
      },
    });

    if (!socio) {
      throw new NotFoundException('Socio no encontrado');
    }

    return armarFichaSocio(
      {
        user_id: socio.user_id,
        name: socio.name,
        document: socio.document,
        birth_date: formatearFecha(socio.birth_date),
        user: socio.user,
        payments: socio.payments.map((pago) => ({
          paid_at: formatearFecha(pago.paid_at),
        })),
        sports: socio.sports.map(({ category }) => ({
          sport: {
            slug: category.sport.slug,
            name: category.sport.name,
            categories: category.sport.categories,
          },
        })),
      },
      obtenerFechaActual(),
    );
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    await this.prisma.$transaction(async (tx) => {
      const socioActual = await tx.member.findUnique({
        where: { user_id: id },
        include: {
          sports: {
            include: {
              category: {
                include: { sport: true },
              },
            },
          },
        },
      });

      if (!socioActual) {
        throw new NotFoundException('Socio no encontrado');
      }

      const birth_date =
        updateMemberDto.birth_date ?? formatearFecha(socioActual.birth_date);

      const deportesActuales = socioActual.sports.map(
        ({ category }) => category.sport.slug,
      );

      const deportesSolicitados = updateMemberDto.sports ?? deportesActuales;

      const actualizarDeportes =
        updateMemberDto.sports !== undefined ||
        updateMemberDto.birth_date !== undefined;

      let deportesSocio: { sport_id: number; category_id: number }[] = [];

      if (actualizarDeportes) {
        const edad = edadEnElAnio(birth_date, obtenerFechaActual());

        const deportes = await tx.sport.findMany({
          where: { slug: { in: deportesSolicitados } },
          include: { categories: true },
        });

        if (deportes.length !== deportesSolicitados.length) {
          throw new NotFoundException('Uno o más deportes no existen');
        }

        deportesSocio = deportes.map((deporte) => {
          const categoria = buscarCategoria(edad, deporte.categories);

          if (!categoria) {
            throw new BadRequestException(
              `No hay una categoría disponible para ${deporte.name}`,
            );
          }

          return {
            sport_id: deporte.id,
            category_id: categoria.id,
          };
        });
      }

      await tx.member.update({
        where: { user_id: id },
        data: {
          ...(updateMemberDto.name !== undefined && {
            name: updateMemberDto.name,
          }),
          ...(updateMemberDto.document !== undefined && {
            document: updateMemberDto.document,
          }),
          ...(updateMemberDto.birth_date !== undefined && {
            birth_date: new Date(`${birth_date}T00:00:00.000Z`),
          }),
          ...(actualizarDeportes && {
            sports: {
              deleteMany: {},
              create: deportesSocio,
            },
          }),
        },
      });
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const socio = await tx.member.findUnique({
        where: { user_id: id },
        select: { user_id: true },
      });

      if (!socio) {
        throw new NotFoundException('Socio no encontrado');
      }

      await tx.user.delete({
        where: { id: socio.user_id },
      });

      return {
        message: 'Socio eliminado correctamente',
      };
    });
  }

  async registerPayment(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const socio = await tx.member.findUnique({
        where: { user_id: id },
        include: {
          payments: {
            orderBy: { paid_at: 'desc' },
            take: 1,
          },
        },
      });

      if (!socio) {
        throw new NotFoundException('Socio no encontrado');
      }

      const ultimoPago = socio.payments[0]
        ? formatearFecha(socio.payments[0].paid_at)
        : null;

      const fechaActual = obtenerFechaActual();
      const fechaPago = calcularFechaDePago(ultimoPago, fechaActual);

      if (!fechaPago) {
        throw new BadRequestException('El socio ya tiene la cuota al día');
      }

      const [anio, mes] = fechaPago.split('-').map(Number);

      const pago = await tx.payment.create({
        data: {
          member_id: id,
          paid_at: new Date(`${fechaPago}T00:00:00.000Z`),
          period_month: mes,
          period_year: anio,
        },
      });

      return {
        message: 'Pago registrado correctamente',
        payment: {
          id: pago.id,
          member_id: pago.member_id,
          paid_at: formatearFecha(pago.paid_at),
          period_month: pago.period_month,
          period_year: pago.period_year,
        },
      };
    });
  }
}
