import { ApiProperty } from '@nestjs/swagger'
import { CreateColumnResponseDto } from './create-column-response.dto'

export class ColumnWithTasksCountResponseDto extends CreateColumnResponseDto {
  @ApiProperty({
    description: 'Number of tasks in the column',
    example: 5,
  })
  tasksCount: number
}

export class DeleteColumnResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Column and tasks deleted successfully',
  })
  message: string
}

export class ReorderResponseDto {
  @ApiProperty({
    description: 'Array of reordered columns',
    type: [CreateColumnResponseDto],
  })
  columns: CreateColumnResponseDto[]
}
