import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { comparePassword } from '../../common/password.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    const email = createAuthDto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);

    const validPassword = user
      ? await comparePassword(createAuthDto.password, user.password_hash)
      : false;

    if (!user || !validPassword) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const access_token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    return { access_token, id: user.id, email: user.email, role: user.role };
  }
}