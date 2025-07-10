import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Server } from 'socket.io'

import { Notification, NotificationDocument } from '@/models/notification.model'
import { FilterNotificationDto } from '@/notifications/dto/request'

@Injectable()
export class NotificationsService {
  private socketServer: Server
  private readonly logger = new Logger(NotificationsService.name)

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  setSocketServer(server: Server) {
    this.socketServer = server
  }

  async sendNotification({
    userIds,
    title,
    description,
    link,
  }: {
    userIds: Types.ObjectId[] | string[]
    title: string
    description: string
    link?: string
  }) {
    if (!this.socketServer) {
      this.logger.error('Socket server is not initialized')
    }

    const userObjectIds: string[] = userIds.map((userId) =>
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId,
    )

    const notification = await this.notificationModel.create({
      userIds: userObjectIds,
      title,
      description,
      link,
      read: false,
    })

    userObjectIds.forEach((userId) => {
      const userIdStr = userId.toString()

      try {
        this.socketServer.to(userIdStr).emit('notification', {
          _id: notification._id,
          title: notification.title,
          description: notification.description,
          createdAt: notification.createdAt,
        })
      } catch (error) {
        this.logger.error(
          `Error sending notification to user ${userIdStr}: ${error.message}`,
        )
      }
    })

    return notification
  }

  async getUserNotifications(
    userId: string | Types.ObjectId,
    filterNotificationDto: FilterNotificationDto,
  ) {
    const { limit, page, search, startDate, endDate } = filterNotificationDto
    const query: any = { userIds: userId }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const notifications = await this.notificationModel
      .find(query)
      .sort({ read: 1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()

    const total = await this.notificationModel.countDocuments(query).exec()

    const unreadCount = await this.getUnreadCount(userId)

    return {
      notifications,
      total,
      unreadCount: unreadCount.count,
    }
  }

  async getUnreadCount(userId: string | Types.ObjectId) {
    const count = await this.notificationModel.countDocuments({
      userIds: userId,
      read: false,
    })

    return { count }
  }

  async markAllAsRead(userId: string | Types.ObjectId) {
    await this.notificationModel.updateMany(
      { userIds: userId, read: false },
      { read: true },
    )

    return { message: 'All notifications marked as read' }
  }

  async markAsRead(notificationId: string) {
    await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    )

    return { message: 'Notification marked as read' }
  }

  async deleteNotification(notificationId: string) {
    await this.notificationModel.findByIdAndDelete(notificationId)

    return { message: 'Notification deleted' }
  }
}
