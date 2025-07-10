import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { JSONContentNode } from '@/common/json-content.dto'

export class TaskFieldDto {
  @ApiProperty({
    description: 'The unique identifier of the field',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The ID of the field definition from the form template',
    example: '507f1f77bcf86cd799439011',
  })
  idField: Types.ObjectId

  @ApiProperty({
    description: 'The value of the field',
    example: 'High',
  })
  value: string
}

export class AssignedUserDto {
  @ApiProperty({
    description: 'The unique identifier of the assigned user',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the assigned user',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'The avatar URL of the assigned user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string

  @ApiProperty({
    description: 'The avatar color of the assigned user',
    example: '#52555E',
  })
  avatarColor: string
}

export class TaskColumnDto {
  @ApiProperty({
    description: 'The unique identifier of the column',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the column',
    example: 'In Progress',
  })
  name: string

  @ApiProperty({
    description: 'The color of the column',
    example: '#FF5722',
  })
  color: string
}

export class TaskProjectDto {
  @ApiProperty({
    description: 'The unique identifier of the project',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the project',
    example: 'Mobile App Development',
  })
  name: string
}

export class TaskResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the task',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the task',
    example: 'Implement user authentication',
  })
  name: string

  @ApiProperty({
    description: 'Rich text description of the task in JSON format',
    example: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This task involves implementing JWT authentication',
            },
          ],
        },
      ],
    },
    required: false,
  })
  description?: JSONContentNode

  @ApiProperty({
    description: 'The code/number of the task',
    example: 1,
  })
  code: number

  @ApiProperty({
    description: 'The order/position of the task within its column',
    example: 1000,
  })
  order: number

  @ApiProperty({
    description: 'The ID of the user assigned to this task',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  assignedToId?: Types.ObjectId

  @ApiProperty({
    description: 'Information about the assigned user',
    type: AssignedUserDto,
    required: false,
  })
  assignedTo?: AssignedUserDto

  @ApiProperty({
    description: 'The ID of the project this task belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  projectId: Types.ObjectId

  @ApiProperty({
    description: 'Information about the project',
    type: TaskProjectDto,
    required: false,
  })
  project?: TaskProjectDto

  @ApiProperty({
    description: 'The ID of the column where this task is placed',
    example: '507f1f77bcf86cd799439011',
  })
  columnId: Types.ObjectId

  @ApiProperty({
    description: 'Information about the column',
    type: TaskColumnDto,
    required: false,
  })
  column?: TaskColumnDto

  @ApiProperty({
    description: 'The ID of the company this task belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  companyId: Types.ObjectId

  @ApiProperty({
    description: 'Custom fields for this task',
    type: [TaskFieldDto],
    required: false,
  })
  fields?: TaskFieldDto[]

  @ApiProperty({
    description: 'The date when the task was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The date when the task was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
