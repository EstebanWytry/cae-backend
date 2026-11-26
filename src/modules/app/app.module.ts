import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';
import { MembersModule } from '../members/members.module.js';
import { NewsModule } from '../news/news.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { SportsModule } from '../sports/sports.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { CoachesModule } from '../coaches/coaches.module.js';
import { SchedulesModule } from '../schedules/schedules.module.js';
import { UploadsModule } from '../uploads/uploads.module.js';
import { PrismaModule } from '../../database/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MembersModule,
    NewsModule,
    NotificationsModule,
    SportsModule,
    CategoriesModule,
    CoachesModule,
    SchedulesModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 
