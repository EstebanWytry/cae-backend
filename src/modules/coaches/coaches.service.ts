import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateCoachDto } from './dto/create-coach.dto.js';
import { UpdateCoachDto } from './dto/update-coach.dto.js';

@Injectable()
export class CoachesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCoachDto: CreateCoachDto) {
    const deporte = await this.prisma.sport.findUnique({
      where: { id: createCoachDto.sport_id },
    });

    if (!deporte) {
      throw new NotFoundException('Deporte no encontrado');
    }

    return this.prisma.coach.create({
      data: createCoachDto,
      include: { sport: true },
    });
  }

  findAll() {
    return this.prisma.coach.findMany({
      include: { sport: true },
      orderBy: [{ sport: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  async findOne(id: number) {
    const profesor = await this.prisma.coach.findUnique({
      where: { id },
      include: { sport: true },
    });

    if (!profesor) {
      throw new NotFoundException('Profesor no encontrado');
    }

    return profesor;
  }

  async update(id: number, updateCoachDto: UpdateCoachDto) {
    try {
      return await this.prisma.coach.update({
        where: { id },
        data: updateCoachDto,
        include: { sport: true },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new NotFoundException('Profesor no encontrado');
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.coach.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new NotFoundException('Profesor no encontrado');
      }

      throw error;
    }

    return { message: 'Profesor eliminado correctamente' };
  }
}
