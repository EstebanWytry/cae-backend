import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // Servicio interno: lo usa auth para buscar cuentas (por email o por id).
  // Los métodos con Prisma se agregan cuando el esquema esté integrado.
}