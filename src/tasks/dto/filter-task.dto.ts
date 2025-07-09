import { ObjectId, Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty({
    required: true,
    description: 'The project id of the task',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: Types.ObjectId

  @ApiProperty({
    required: false,
    description: 'The name of the task',
    example: 'Task 1',
  })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({
    required: false,
    description: 'The columns id of the task',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return toObjectId(value, false).filter(Boolean)
    } else {
      return [toObjectId(value, false)].filter(Boolean)
    }
  })
  @IsArray()
  columnsId: Types.ObjectId[] | null

  @ApiProperty({
    required: false,
    description: 'The assigned to id of the task',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return toObjectId(value, false).filter(Boolean)
    } else {
      return [toObjectId(value, false)].filter(Boolean)
    }
  })
  @IsArray()
  assignedToId: Types.ObjectId[] | null

  @ApiProperty({
    required: false,
    description: 'The search of the task',
    example: 'Task 1',
  })
  @IsString()
  @IsOptional()
  search: string

  @ApiProperty({
    required: false,
    description: 'The from updated at of the task',
    example: '2021-01-01',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromUpdatedAt: Date

  @ApiProperty({
    required: false,
    description: 'The to updated at of the task',
    example: '2021-01-01',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toUpdatedAt: Date

  @ApiProperty({
    required: false,
    description: 'The from created at of the task',
    example: '2021-01-01',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromCreatedAt: Date

  @ApiProperty({
    required: false,
    description: 'The to created at of the task',
    example: '2021-01-01',
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toCreatedAt: Date

  @ApiProperty({
    required: false,
    description: 'The sort of the task',
    example: [{ id: '123e4567-e89b-12d3-a456-426614174000', desc: true }],
  })
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

  @ApiProperty({
    required: false,
    description: 'The offset of the task',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset: number

  @ApiProperty({
    description: 'The limit of the task',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => Number(value))
  limit: number
}
