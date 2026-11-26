import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateSportDto } from './dto/create-sport.dto.js';
import { UpdateSportDto } from './dto/update-sport.dto.js';

@Injectable()
export class SportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSportDto: CreateSportDto) {
    try {
      return await this.prisma.sport.create({
        data: createSportDto,
        include: {
          categories: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException('Ya existe un deporte con ese slug');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.sport.findMany({
      include: {
        categories: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const deporte = await this.prisma.sport.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!deporte) {
      throw new NotFoundException('Deporte no encontrado');
    }

    return deporte;
  }

  async update(id: number, updateSportDto: UpdateSportDto) {
    try {
      return await this.prisma.sport.update({
        where: { id },
        data: updateSportDto,
        include: {
          categories: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new NotFoundException('Deporte no encontrado');
      }

      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException('Ya existe un deporte con ese slug');
      }

      throw error;
    }
  }

  async remove(id: number) {
    const deporte = await this.prisma.sport.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
            members: {
              select: { member_id: true },
              take: 1,
            },
            schedules: {
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!deporte) {
      throw new NotFoundException('Deporte no encontrado');
    }

    const tieneSocios = deporte.categories.some(
      (categoria) => categoria.members.length > 0,
    );

    const tieneHorarios = deporte.categories.some(
      (categoria) => categoria.schedules.length > 0,
    );

    if (tieneSocios || tieneHorarios) {
      throw new ConflictException(
        'No se puede eliminar un deporte que tiene socios u horarios asociados',
      );
    }

    await this.prisma.sport.delete({
      where: { id },
    });

    return {
      message: 'Deporte eliminado correctamente',
    };
  }
}
