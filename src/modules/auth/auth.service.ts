import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';

@Injectable()
export class AuthService {
  login(createAuthDto: CreateAuthDto) {
    const email = createAuthDto.email.trim().toLowerCase();

    return {
      email,
    };
  }
}
