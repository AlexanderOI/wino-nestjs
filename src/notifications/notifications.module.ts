import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'

import { NotificationsService } from '@/notifications/notifications.service'
import { NotificationsController } from '@/notifications/notifications.controller'
import { NotificationsGateway } from '@/notifications/notifications.gateway'
import { Notification, NotificationSchema } from '@/models/notification.model'

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway, JwtService],
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
