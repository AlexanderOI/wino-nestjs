import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'

import { JSONContentNode } from '@/common/json-content.dto'
import { toObjectId } from '@/common/transformer.mongo-id'

export class CreateCommentDto {
  @ApiProperty({
    description: 'The ID of the task this comment belongs to',
    type: String,
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  taskId: Types.ObjectId

  @ApiProperty({
    description: 'The ID of the user creating the comment',
    type: String,
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
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
              text: 'This is a comment with ',
            },
            {
              type: 'text',
              text: 'bold text',
              marks: [{ type: 'bold' }],
            },
          ],
        },
      ],
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => JSONContentNode)
  content: JSONContentNode

  @ApiProperty({
    description: 'The ID of the parent comment if this is a reply',
    type: String,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  parentId?: Types.ObjectId
}
