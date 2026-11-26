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

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    const { name, document, email, birth_date, sports, paid_at } =
      createMemberDto;

    const fechaActual = new Date().toISOString().slice(0, 10);
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

  findAll() {
    return `This action returns all members`;
  }

  findMe(id: number) {
    return `This action returns the profile of member #${id}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  registerPayment(id: number) {
    return `This action registers a payment for member #${id}`;
  }
}
