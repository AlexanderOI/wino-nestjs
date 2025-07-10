import { ApiProperty } from '@nestjs/swagger'
import { TaskResponseDto } from './task-response.dto'

export class UpdateTaskResponseDto extends TaskResponseDto {
  @ApiProperty({
    description: 'Success message for task update',
    example: 'Task updated successfully',
    required: false,
  })
  message?: string
}
