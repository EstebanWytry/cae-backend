import { Module } from '@nestjs/common';
import { SportsService } from './sports.service.js';
import { SportsController } from './sports.controller.js';

@Module({
  controllers: [SportsController],
  providers: [SportsService],
})
export class SportsModule {}
