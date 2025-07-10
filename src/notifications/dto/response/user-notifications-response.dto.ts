import { ApiProperty } from '@nestjs/swagger'
import { NotificationResponseDto } from './notification-response.dto'

export class UserNotificationsResponseDto {
  @ApiProperty({
    description: 'List of notifications for the user',
    type: [NotificationResponseDto],
    isArray: true,
  })
  notifications: NotificationResponseDto[]

  @ApiProperty({
    description: 'Total number of notifications that match the filter criteria',
    example: 45,
  })
  total: number

  @ApiProperty({
    description: 'Number of unread notifications for the user',
    example: 3,
  })
  unreadCount: number
}
