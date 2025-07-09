import { Types } from 'mongoose'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { toObjectId } from '@/common/transformer.mongo-id'

export class MoveTaskPositionDto {
  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  insertAfterTaskId?: Types.ObjectId
}
