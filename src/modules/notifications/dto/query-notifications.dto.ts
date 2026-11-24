import { IsIn, IsOptional } from 'class-validator';
import {
  TIPOS_DE_NOTIFICACION,
  type TipoNotificacion,
} from '../rules/notification-rules.js';

export class QueryNotificationsDto {
  @IsOptional()
  @IsIn(TIPOS_DE_NOTIFICACION, {
    message:
      'El tipo debe ser por_vencer, pendiente, vencida, inactivo o sin_pagos',
  })
  type?: TipoNotificacion;
}