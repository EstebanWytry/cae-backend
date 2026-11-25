import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MembersService } from './members.service.js';
import { CreateMemberDto } from './dto/create-member.dto.js';
import { UpdateMemberDto } from './dto/update-member.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('members')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get('me')
  @Roles('admin', 'member')
  findMe(@Req() req: { user: { id: number; role: string } }) {
    return this.membersService.findMe(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }

  @Post(':id/payments')
  registerPayment(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('El id del socio debe ser un número'),
      }),
    )
    id: number,
  ) {
    return this.membersService.registerPayment(id);
  }
}