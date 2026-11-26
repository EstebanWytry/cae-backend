import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { UploadsService } from '../uploads/uploads.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  create(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: {
        ...createNewsDto,
        date: new Date(`${createNewsDto.date}T00:00:00.000Z`),
      },
    });
  }

  findAll() {
    return this.prisma.news.findMany({
      orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
    });
  }

  async findOne(id: number) {
    const noticia = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!noticia) {
      throw new NotFoundException('Noticia no encontrada');
    }

    return noticia;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const noticiaActual = await this.findOne(id);

    const noticiaActualizada = await this.prisma.news.update({
      where: { id },
      data: {
        ...updateNewsDto,
        ...(updateNewsDto.date !== undefined && {
          date: new Date(`${updateNewsDto.date}T00:00:00.000Z`),
        }),
      },
    });

    if (
      noticiaActual.image &&
      updateNewsDto.image !== undefined &&
      noticiaActual.image !== updateNewsDto.image
    ) {
      await this.uploadsService.removeByUrl(noticiaActual.image);
    }

    return noticiaActualizada;
  }

  async remove(id: number) {
    const noticia = await this.findOne(id);

    await this.prisma.news.delete({
      where: { id },
    });

    if (noticia.image) {
      await this.uploadsService.removeByUrl(noticia.image);
    }

    return {
      message: 'Noticia eliminada correctamente',
    };
  }
}