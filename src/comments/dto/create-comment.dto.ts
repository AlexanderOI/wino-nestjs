import { Types } from 'mongoose'
import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'

import { JSONContentNode } from '@/common/json-content.dto'
import { toObjectId } from '@/common/transformer.mongo-id'

export class CreateCommentDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  taskId: Types.ObjectId

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  userId: Types.ObjectId

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => JSONContentNode)
  content: JSONContentNode

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  parentId?: Types.ObjectId
}
