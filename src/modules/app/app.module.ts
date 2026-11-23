import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';
import { MembersModule } from '../members/members.module.js';
import { NewsModule } from '../news/news.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { SportsModule } from '../sports/sports.module.js';
import { UploadsModule } from '../uploads/uploads.module.js';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MembersModule,
    NewsModule,
    NotificationsModule,
    SportsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
