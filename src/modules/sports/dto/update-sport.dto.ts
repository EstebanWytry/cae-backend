import { PartialType } from '@nestjs/mapped-types';
import { CreateSportDto } from './create-sport.dto.js';

export class UpdateSportDto extends PartialType(CreateSportDto) {}
