import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { JSONContentNode } from '@/common/json-content.dto'

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  userName: string

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'User avatar URL',
    example: 'avatar.jpg',
    required: false,
  })
  avatar?: string
}

export class CreateCommentResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the comment',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The ID of the task this comment belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  taskId: Types.ObjectId

  @ApiProperty({
    description: 'The ID of the user who created the comment',
    example: '507f1f77bcf86cd799439011',
  })
  userId: Types.ObjectId

  @ApiProperty({
    description: 'Rich text content of the comment in JSON format',
    example: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a comment',
            },
          ],
        },
      ],
    },
  })
  content: JSONContentNode

  @ApiProperty({
    description: 'The ID of the parent comment if this is a reply',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  parentId?: Types.ObjectId

  @ApiProperty({
    description: 'Whether the comment has been edited',
    example: false,
  })
  isEdited: boolean

  @ApiProperty({
    description: 'Information about the user who created the comment',
    type: UserInfoDto,
    required: false,
  })
  user?: UserInfoDto

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date
}
