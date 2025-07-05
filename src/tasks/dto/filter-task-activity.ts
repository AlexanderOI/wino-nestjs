import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'
import { Transform } from 'class-transformer'

import { toObjectId } from '@/common/transformer.mongo-id'

export class FilterTaskActivityDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: string

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  taskId?: string

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  userId?: string

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
