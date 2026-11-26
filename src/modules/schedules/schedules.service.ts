import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateScheduleDto } from './dto/create-schedule.dto.js';
import { UpdateScheduleDto } from './dto/update-schedule.dto.js';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  private timeToDate(time: string): Date {
    return new Date(`1970-01-01T${time}:00.000Z`);
  }

  private dateToTime(date: Date): string {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(
      date.getUTCMinutes(),
    ).padStart(2, '0')}`;
  }

  private validateTimes(startTime: string, endTime: string) {
    if (startTime >= endTime) {
      throw new BadRequestException(
        'La hora de finalización debe ser posterior a la hora de inicio',
      );
    }
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const {
      sport_id,
      category_id,
      start_time,
      end_time,
    } = createScheduleDto;

    this.validateTimes(start_time, end_time);

    const categoria = await this.prisma.category.findUnique({
      where: {
        id_sport_id: {
          id: category_id,
          sport_id,
        },
      },
    });

    if (!categoria) {
      throw new NotFoundException(
        'La categoría no existe o no pertenece al deporte indicado',
      );
    }

    return this.prisma.schedule.create({
      data: {
        ...createScheduleDto,
        start_time: this.timeToDate(start_time),
        end_time: this.timeToDate(end_time),
      },
      include: {
        category: {
          include: {
            sport: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.schedule.findMany({
      include: {
        category: {
          include: {
            sport: true,
          },
        },
      },
      orderBy: [{ day: 'asc' }, { start_time: 'asc' }],
    });
  }

  async findOne(id: number) {
    const horario = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            sport: true,
          },
        },
      },
    });

    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    return horario;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const horarioActual = await this.findOne(id);

    const startTime =
      updateScheduleDto.start_time ??
      this.dateToTime(horarioActual.start_time);

    const endTime =
      updateScheduleDto.end_time ??
      this.dateToTime(horarioActual.end_time);

    this.validateTimes(startTime, endTime);

    const { start_time, end_time, ...rest } = updateScheduleDto;

    return this.prisma.schedule.update({
      where: { id },
      data: {
        ...rest,
        ...(start_time !== undefined && {
          start_time: this.timeToDate(start_time),
        }),
        ...(end_time !== undefined && {
          end_time: this.timeToDate(end_time),
        }),
      },
      include: {
        category: {
          include: {
            sport: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.schedule.delete({
      where: { id },
    });

    return {
      message: 'Horario eliminado correctamente',
    };
  }
}
