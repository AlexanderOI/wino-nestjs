import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ObjectId } from 'mongoose'
import { JSONContentNode } from '@/common/json-content.dto'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @ValidateNested()
  @Type(() => JSONContentNode)
  description: JSONContentNode

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  assignedToId: ObjectId

  @IsNumber()
  @IsOptional()
  order: number

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  columnId: ObjectId

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: ObjectId
}
