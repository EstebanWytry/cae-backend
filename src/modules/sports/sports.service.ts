import { Injectable } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto.js';
import { UpdateSportDto } from './dto/update-sport.dto.js';

@Injectable()
export class SportsService {
  create(createSportDto: CreateSportDto) {
    return createSportDto;
  }

  findAll() {
    return `This action returns all sports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sport`;
  }

  update(id: number, updateSportDto: UpdateSportDto) {
    const changes: Partial<CreateSportDto> = {};

    if (updateSportDto.slug !== undefined) {
      changes.slug = updateSportDto.slug;
    }
    if (updateSportDto.name !== undefined) {
      changes.name = updateSportDto.name;
    }
    if (updateSportDto.description !== undefined) {
      changes.description = updateSportDto.description;
    }
    if (updateSportDto.image !== undefined) {
      changes.image = updateSportDto.image;
    }

    return {
      id,
      changes,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} sport`;
  }
}
