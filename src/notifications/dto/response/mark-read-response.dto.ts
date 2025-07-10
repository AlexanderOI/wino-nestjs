import { ApiProperty } from '@nestjs/swagger'

export class MarkReadResponseDto {
  @ApiProperty({
    description: 'Number of notifications that were marked as read',
    example: 3,
  })
  message: string
}

export class MarkSingleReadResponseDto {
  @ApiProperty({
    description: 'Message indicating the result of the operation',
    example: 'Notification marked as read',
  })
  message: string
}
