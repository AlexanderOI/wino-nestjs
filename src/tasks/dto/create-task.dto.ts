import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ObjectId } from 'mongoose'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  assignedTo: string

  @IsNumber()
  @IsOptional()
  order: number

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  columnId: ObjectId

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: ObjectId

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate: Date

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate: Date
}
