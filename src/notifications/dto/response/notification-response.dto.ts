import { ApiProperty } from '@nestjs/swagger'

export class NotificationResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the notification',
    type: String,
    example: '507f1f77bcf86cd799439011',
  })
  _id: string

  @ApiProperty({
    description: 'List of user IDs who will receive this notification',
    type: [String],
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
  })
  userIds: string[]

  @ApiProperty({
    description: 'Title of the notification',
    example: 'Nueva tarea asignada',
  })
  title: string

  @ApiProperty({
    description: 'Detailed description of the notification',
    example: 'Se te ha asignado una nueva tarea en el proyecto Frontend',
  })
  description: string

  @ApiProperty({
    description: 'Optional link related to the notification',
    required: false,
    example: '/projects/507f1f77bcf86cd799439011/tasks/507f1f77bcf86cd799439012',
  })
  link?: string

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
  })
  read: boolean

  @ApiProperty({
    description: 'Date when the notification was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string

  @ApiProperty({
    description: 'Date when the notification was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: string
}
