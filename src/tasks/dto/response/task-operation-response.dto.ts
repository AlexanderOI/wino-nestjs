import { ApiProperty } from '@nestjs/swagger'

export class TaskOperationResponseDto {
  @ApiProperty({
    description: 'Success message for the operation',
    example: 'Task updated successfully',
  })
  message: string
}

export class ReorderTasksResponseDto {
  @ApiProperty({
    description: 'Success message for task reordering',
    example: 'Tasks reordered successfully',
  })
  message: string
}

export class TotalTasksResponseDto {
  @ApiProperty({
    description: 'Total number of tasks in the company',
    example: 150,
  })
  total: number
}
