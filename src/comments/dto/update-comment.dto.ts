import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { JSONContentNode } from '@/common/json-content.dto'

export class UpdateCommentDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => JSONContentNode)
  content: JSONContentNode
}
