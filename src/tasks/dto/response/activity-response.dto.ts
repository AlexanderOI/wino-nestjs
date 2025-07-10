import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class ActivityUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string

  @ApiProperty({
    description: 'The avatar color of the user',
    example: '#52555E',
  })
  avatarColor: string
}

export class ActivityTaskDto {
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
}

export class ActivityColumnDto {
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

export class ActivityResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the activity',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The ID of the task this activity belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  taskId: Types.ObjectId

  @ApiProperty({
    description: 'Information about the task',
    type: ActivityTaskDto,
    required: false,
  })
  task?: ActivityTaskDto

  @ApiProperty({
    description: 'Information about the column',
    type: ActivityColumnDto,
    required: false,
  })
  column?: ActivityColumnDto

  @ApiProperty({
    description: 'The type of activity',
    example: 'update',
  })
  type: string

  @ApiProperty({
    description: 'Description of the activity',
    example: 'John Doe updated the task name to "New Task Name"',
  })
  text: string

  @ApiProperty({
    description: 'The previous value before the change',
    example: 'Old Task Name',
    required: false,
  })
  previousValue?: string

  @ApiProperty({
    description: 'The new value after the change',
    example: 'New Task Name',
    required: false,
  })
  newValue?: string

  @ApiProperty({
    description: 'The ID of the user who performed the activity',
    example: '507f1f77bcf86cd799439011',
  })
  userId: Types.ObjectId

  @ApiProperty({
    description: 'Information about the user who performed the activity',
    type: ActivityUserDto,
    required: false,
  })
  user?: ActivityUserDto

  @ApiProperty({
    description: 'The ID of the project',
    example: '507f1f77bcf86cd799439011',
  })
  projectId: Types.ObjectId

  @ApiProperty({
    description: 'The date when the activity was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date
}
