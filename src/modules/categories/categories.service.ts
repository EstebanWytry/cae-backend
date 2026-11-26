import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { sport_id, min_age, max_age } = createCategoryDto;

    if (max_age !== undefined && max_age <= min_age) {
      throw new BadRequestException(
        'La edad máxima debe ser mayor que la edad mínima',
      );
    }

    const deporte = await this.prisma.sport.findUnique({
      where: { id: sport_id },
    });

    if (!deporte) {
      throw new NotFoundException('Deporte no encontrado');
    }

    try {
      return await this.prisma.category.create({
        data: createCategoryDto,
        include: {
          sport: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una categoría con ese nombre para este deporte',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        sport: true,
      },
      orderBy: [{ sport: { name: 'asc' } }, { min_age: 'asc' }],
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.category.findUnique({
      where: { id },
      include: {
        sport: true,
        schedules: true,
      },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categoriaActual = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!categoriaActual) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const minAge = updateCategoryDto.min_age ?? categoriaActual.min_age;
    const maxAge =
      updateCategoryDto.max_age !== undefined
        ? updateCategoryDto.max_age
        : categoriaActual.max_age;

    if (maxAge !== null && maxAge <= minAge) {
      throw new BadRequestException(
        'La edad máxima debe ser mayor que la edad mínima',
      );
    }

    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          sport: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una categoría con ese nombre para este deporte',
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    const categoria = await this.prisma.category.findUnique({
      where: { id },
      include: {
        members: {
          select: { member_id: true },
          take: 1,
        },
        schedules: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    if (categoria.members.length > 0 || categoria.schedules.length > 0) {
      throw new ConflictException(
        'No se puede eliminar una categoría que tiene socios u horarios asociados',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Categoría eliminada correctamente',
    };
  }
}
