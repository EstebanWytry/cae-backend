import { Body, Controller, Post } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { NewsService } from './news.service.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }
}