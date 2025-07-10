import { ApiProperty } from '@nestjs/swagger'
import { CreateColumnResponseDto } from './create-column-response.dto'

export class UpdateColumnResponseDto extends CreateColumnResponseDto {
  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date
}
