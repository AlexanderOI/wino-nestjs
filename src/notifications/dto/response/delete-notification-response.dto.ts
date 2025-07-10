import { ApiProperty } from '@nestjs/swagger'

export class DeleteNotificationResponseDto {
  @ApiProperty({
    description: 'Message indicating the result of the operation',
    example: 'Notification deleted',
  })
  message: string
}
