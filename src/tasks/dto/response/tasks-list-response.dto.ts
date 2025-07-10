import { ApiProperty } from '@nestjs/swagger'
import { TaskResponseDto } from './task-response.dto'

export class TasksListResponseDto {
  @ApiProperty({
    description: 'Array of tasks',
    type: [TaskResponseDto],
  })
  tasks: TaskResponseDto[]

  @ApiProperty({
    description: 'Total number of tasks matching the filter criteria',
    example: 25,
  })
  total: number
}
