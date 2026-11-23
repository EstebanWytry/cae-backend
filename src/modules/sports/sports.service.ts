import { Injectable } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto.js';
import { UpdateSportDto } from './dto/update-sport.dto.js';

@Injectable()
export class SportsService {
  create(createSportDto: CreateSportDto) {
    return 'This action adds a new sport';
  }

  findAll() {
    return `This action returns all sports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sport`;
  }

  update(id: number, updateSportDto: UpdateSportDto) {
    return `This action updates a #${id} sport`;
  }

  remove(id: number) {
    return `This action removes a #${id} sport`;
  }
}
