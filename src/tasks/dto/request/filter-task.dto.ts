import { Types } from 'mongoose'
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
  @ApiProperty({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    description: 'Whether to sort in descending order',
    example: true,
  })
  @IsBoolean()
  desc: boolean
}

export class FilterTaskDto {
  @ApiProperty({
    description: 'The project ID to filter tasks by',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: Types.ObjectId

  @ApiProperty({
    description: 'Filter by task name',
    example: 'authentication',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'Array of column IDs to filter tasks by',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
    required: false,
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
  columnsId?: Types.ObjectId[] | null

  @ApiProperty({
    description: 'Array of user IDs to filter tasks by assignee',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
    required: false,
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
  assignedToId?: Types.ObjectId[] | null

  @ApiProperty({
    description: 'Search term to filter tasks by name or description',
    example: 'authentication',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string

  @ApiProperty({
    description: 'Filter tasks updated from this date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromUpdatedAt?: Date

  @ApiProperty({
    description: 'Filter tasks updated until this date',
    example: '2023-12-31T23:59:59.999Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toUpdatedAt?: Date

  @ApiProperty({
    description: 'Filter tasks created from this date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  fromCreatedAt?: Date

  @ApiProperty({
    description: 'Filter tasks created until this date',
    example: '2023-12-31T23:59:59.999Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  toCreatedAt?: Date

  @ApiProperty({
    description: 'Sorting configuration',
    example: [{ id: 'createdAt', desc: true }],
    type: [SortDto],
    required: false,
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
    description: 'Number of tasks to skip (for pagination)',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset?: number

  @ApiProperty({
    description: 'Maximum number of tasks to return',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => Number(value))
  limit?: number
}
