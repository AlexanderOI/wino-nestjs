import { Types } from 'mongoose'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { toObjectId } from '@/common/transformer.mongo-id'

export class MoveToColumnDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  newColumnId: Types.ObjectId

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  insertAfterTaskId?: Types.ObjectId
}
