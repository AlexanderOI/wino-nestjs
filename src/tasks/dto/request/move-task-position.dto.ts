import { Types } from 'mongoose'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { toObjectId } from '@/common/transformer.mongo-id'

export class MoveTaskPositionDto {
  @ApiProperty({
    description: 'The ID of the task after which to insert this task (optional)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  insertAfterTaskId?: Types.ObjectId
}
