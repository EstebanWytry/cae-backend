import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto.js';

export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['sport_id'] as const),
) {}
