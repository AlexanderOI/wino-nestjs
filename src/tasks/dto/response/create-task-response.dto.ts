import { ApiProperty } from '@nestjs/swagger'
import { TaskResponseDto } from './task-response.dto'

export class CreateTaskResponseDto extends TaskResponseDto {
  @ApiProperty({
    description: 'Success message for task creation',
    example: 'Task created successfully',
    required: false,
  })
  message?: string
}
