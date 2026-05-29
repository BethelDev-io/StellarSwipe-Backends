import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationPreference } from './preferences/entities/notification-preference.entity';
import { PreferencesService } from './preferences/preferences.service';
import { PreferencesController } from './preferences/preferences.controller';
import { Notification } from './entities/notification.entity';
import { NotificationProcessor } from './processor/notification-processor';
import { NotificationsService } from './notifications.service';
import { NOTIFICATION_QUEUE } from './notification.queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreference, Notification]),
    BullModule.registerQueueAsync({
      name: NOTIFICATION_QUEUE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host') ?? 'localhost',
          port: configService.get<number>('redis.port') ?? 6379,
          password: configService.get<string>('redis.password'),
          db: configService.get<number>('redis.db') ?? 0,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      }),
    }),
  ],
  controllers: [PreferencesController],
  providers: [
    PreferencesService,
    NotificationProcessor,
    NotificationsService,
  ],
  exports: [PreferencesService, NotificationsService],
})
export class NotificationsModule {}

