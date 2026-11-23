import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto.js';

@Injectable()
export class NewsService {
  create(createNewsDto: CreateNewsDto) {
    // Por ahora devolvemos lo recibido. La base de datos se conecta con Prisma más adelante.
    return createNewsDto;
  }
}