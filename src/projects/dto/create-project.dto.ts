import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform, Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsDate } from 'class-validator'
import { ObjectId } from 'mongoose'

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  leaderId: ObjectId

  @IsNotEmpty()
  @IsString()
  client: string

  @IsNotEmpty()
  @IsString()
  status: string

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date
}
