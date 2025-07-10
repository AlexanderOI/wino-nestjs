import { ApiProperty } from '@nestjs/swagger'

export class UnreadCountResponseDto {
  @ApiProperty({
    description: 'Number of unread notifications for the user',
    example: 5,
  })
  count: number
}
