import { ApiProperty } from '@nestjs/swagger'
import { CreateColumnResponseDto } from './create-column-response.dto'

export class ColumnListResponseDto extends CreateColumnResponseDto {
  @ApiProperty({
    description: 'Array of columns',
    type: [CreateColumnResponseDto],
  })
  columns: CreateColumnResponseDto[]
}

export class ColumnWithTasksResponseDto extends CreateColumnResponseDto {
  @ApiProperty({
    description: 'Array of tasks in the column',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        name: { type: 'string', example: 'Task 1' },
        description: { type: 'string', example: 'Task description' },
        code: { type: 'string', example: 'TSK-001' },
        order: { type: 'number', example: 1000 },
        columnId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        assignedToId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        assignedTo: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            avatar: { type: 'string', example: 'avatar.jpg' },
            avatarColor: { type: 'string', example: '#ff0000' },
          },
        },
      },
    },
  })
  tasks: Array<{
    _id: string
    name: string
    description: string
    code: string
    order: number
    columnId: string
    assignedToId: string
    assignedTo: {
      name: string
      avatar: string
      avatarColor: string
    }
  }>
}
