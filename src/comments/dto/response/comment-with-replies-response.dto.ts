import { ApiProperty } from '@nestjs/swagger'
import { CreateCommentResponseDto } from './create-comment-response.dto'

export class CommentWithRepliesResponseDto extends CreateCommentResponseDto {
  @ApiProperty({
    description: 'Array of nested replies to this comment',
    type: [CreateCommentResponseDto],
    isArray: true,
  })
  replies: CommentWithRepliesResponseDto[]
}

export class UpdateCommentResponseDto extends CreateCommentResponseDto {
  @ApiProperty({
    description: 'Whether the comment has been edited',
    example: true,
  })
  isEdited: boolean

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date
}

export class DeleteCommentResponseDto extends CreateCommentResponseDto {
  @ApiProperty({
    description: 'Confirmation that the comment was deleted',
    example: true,
  })
  deleted: boolean
}

export class UploadImageResponseDto {
  @ApiProperty({
    description: 'URL of the uploaded image',
    example:
      'https://res.cloudinary.com/example/image/upload/v1234567890/comments/image.jpg',
  })
  url: string
}
