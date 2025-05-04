import { ObjectId } from 'mongoose'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'

import { toObjectId } from '@/common/transformer.mongo-id'

export class SortDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsBoolean()
  desc: boolean
}

export class FilterTaskDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: ObjectId

  @IsString()
  @IsOptional()
  name: string

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return toObjectId(value, false).filter(Boolean)
    } else {
      return [toObjectId(value, false)].filter(Boolean)
    }
  })
  @IsArray()
  columnsId: ObjectId[] | null

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return toObjectId(value, false).filter(Boolean)
    } else {
      return [toObjectId(value, false)].filter(Boolean)
    }
  })
  @IsArray()
  assignedToId: ObjectId[] | null

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

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromCreatedAt: Date

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toCreatedAt: Date

  @IsOptional()
  @Transform(({ value }) => {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map((item) => Object.assign(new SortDto(), item))
      }
      return []
    } catch {
      return []
    }
  })
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sort?: SortDto[]

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
