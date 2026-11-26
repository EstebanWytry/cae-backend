import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCoachDto } from './create-coach.dto.js';

export class UpdateCoachDto extends PartialType(
  OmitType(CreateCoachDto, ['sport_id'] as const),
) {}
