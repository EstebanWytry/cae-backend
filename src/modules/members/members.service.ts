import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';
import { hashPassword } from '../../common/password.js';

@Injectable()
export class MembersService {
    async create(createMemberDto: CreateMemberDto) {
    const password_hash = await hashPassword(createMemberDto.document);

    return { ...createMemberDto, password_hash };
  }

  findAll() {
    return `This action returns all members`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}