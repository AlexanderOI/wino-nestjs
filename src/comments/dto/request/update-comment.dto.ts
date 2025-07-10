import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { JSONContentNode } from '@/common/json-content.dto'

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated rich text content of the comment in JSON format',
    example: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is an updated comment with ',
            },
            {
              type: 'text',
              text: 'italic text',
              marks: [{ type: 'italic' }],
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
}
