import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform } from 'class-transformer'
import { IsDate, IsNumber, IsString, Min } from 'class-validator'
import { IsOptional } from 'class-validator'
import { ObjectId } from 'mongoose'

export class FilterTaskDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  columnId: ObjectId

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  projectId: ObjectId

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  assignedToId: ObjectId

  @IsString()
  @IsOptional()
  status: string

  @IsString()
  @IsOptional()
  search: string

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromUpdatedAt: Date

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toUpdatedAt: Date

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset: number

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => Number(value))
  limit: number
}
