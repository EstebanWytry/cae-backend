import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';

@Injectable()
export class MembersService {
  create(createMemberDto: CreateMemberDto) {
    // Por ahora devolvemos lo recibido. La base de datos se conecta con Prisma más adelante.
    return createMemberDto;
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

  
  registerPayment(id: number) {
    // Por ahora devolvemos un texto. El cálculo de la fecha con calcularFechaDePago se conecta con Prisma más adelante.
    return `This action registers a payment for member #${id}`;
  }
}