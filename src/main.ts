import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './modules/app/app.module.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Conservá aquí el resto de tu configuración actual.

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();