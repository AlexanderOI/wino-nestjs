import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class FilterNotificationDto {
  @ApiProperty({
    description: 'Number of notifications to return per page',
    minimum: 1,
    default: 10,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number

  @ApiProperty({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number

  @ApiProperty({
    description: 'Search term to filter notifications by title or description',
    required: false,
    example: 'task assignment',
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({
    description: 'Start date for filtering notifications (ISO string)',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  startDate?: string

  @ApiProperty({
    description: 'End date for filtering notifications (ISO string)',
    required: false,
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  endDate?: string
}
