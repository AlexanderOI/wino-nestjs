import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ObjectId } from 'mongoose'

class JSONContentMark {
  @IsString()
  type: string

  @IsOptional()
  attrs?: Record<string, any>
}

class JSONContentNode {
  @IsString()
  type: string

  @IsOptional()
  attrs?: Record<string, any>

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONContentNode)
  content?: JSONContentNode[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONContentMark)
  marks?: JSONContentMark[]

  @IsOptional()
  @IsString()
  text?: string
}

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
