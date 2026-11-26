import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service.js';
import { CoachesController } from './coaches.controller.js';

@Module({
  controllers: [CoachesController],
  providers: [CoachesService],
})
export class CoachesModule {}
