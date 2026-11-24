import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto.js';

export class UpdateMemberDto extends PartialType(
  OmitType(CreateMemberDto, ['email', 'paid_at'] as const),
) {}