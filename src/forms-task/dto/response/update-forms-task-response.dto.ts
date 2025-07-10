import { ApiProperty } from '@nestjs/swagger'
import { CreateFormsTaskResponseDto } from './create-forms-task-response.dto'

export class UpdateFormsTaskResponseDto extends CreateFormsTaskResponseDto {
  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date
}
