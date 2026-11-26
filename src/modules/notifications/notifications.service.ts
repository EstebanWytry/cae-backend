import { Injectable } from '@nestjs/common';
import { fechaDeHoy } from '../../common/today.js';
import { MembersService } from '../members/members.service.js';
import {
  armarNotificaciones,
  type TipoNotificacion,
} from './rules/notification-rules.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly membersService: MembersService) {}

  async findAll(tipo?: TipoNotificacion) {
    const hoy = fechaDeHoy();
    const fichas = await this.membersService.findAll();

    return armarNotificaciones(fichas, hoy, tipo);
  }
}
