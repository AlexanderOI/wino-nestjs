import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class FilterProjectsDto {
  @ApiProperty({
    description: 'Search term for project name or description',
    required: false,
    example: 'website',
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10
}
