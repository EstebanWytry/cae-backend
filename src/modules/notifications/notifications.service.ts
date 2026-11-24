import { Injectable } from '@nestjs/common';
import { fechaDeHoy } from '../../common/today.js';
import { type FichaSocio } from '../members/rules/member-summary.js';
import {
  armarNotificaciones,
  type TipoNotificacion,
} from './rules/notification-rules.js';

@Injectable()
export class NotificationsService {
  findAll(tipo?: TipoNotificacion) {
    const hoy = fechaDeHoy();
    // Por ahora no hay socios: la base de datos se conecta con Prisma más adelante.
    const fichas: FichaSocio[] = [];
    return armarNotificaciones(fichas, hoy, tipo);
  }
}