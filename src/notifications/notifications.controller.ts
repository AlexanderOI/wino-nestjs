import { Controller, Get, Param, Patch, Delete, Query } from '@nestjs/common'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'

import { UserAuth } from '@/types'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'

import { NotificationsService } from '@/notifications/notifications.service'
import { FilterNotificationDto } from '@/notifications/dto/filter-notification.dto'

@Auth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @User() user: UserAuth,
    @Query() filterNotificationDto: FilterNotificationDto,
  ) {
    return this.notificationsService.getUserNotifications(user._id, filterNotificationDto)
  }

  @Get('unread-count')
  async getUnreadCount(@User() user: UserAuth) {
    return this.notificationsService.getUnreadCount(user._id)
  }

  @Patch('read')
  async markAllAsRead(@User() user: UserAuth) {
    return this.notificationsService.markAllAsRead(user._id)
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseMongoIdPipe) id: string) {
    return this.notificationsService.markAsRead(id)
  }

  @Delete(':id')
  async deleteNotification(@Param('id', ParseMongoIdPipe) id: string) {
    return this.notificationsService.deleteNotification(id)
  }
}
