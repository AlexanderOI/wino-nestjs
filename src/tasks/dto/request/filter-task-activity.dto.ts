import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { toObjectId } from '@/common/transformer.mongo-id'

export class FilterTaskActivityDto {
  @ApiProperty({
    description: 'The project ID to filter activities by',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: string

  @ApiProperty({
    description: 'Filter activities by specific task ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  taskId?: string

  @ApiProperty({
    description: 'Filter activities by specific user ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  userId?: string

  @ApiProperty({
    description: 'Number of activities to skip (for pagination)',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset?: number

  @ApiProperty({
    description: 'Maximum number of activities to return',
    example: 15,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => Number(value))
  limit?: number
}
