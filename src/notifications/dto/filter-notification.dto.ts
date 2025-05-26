import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class FilterNotificationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  startDate?: string

  @IsOptional()
  @IsString()
  endDate?: string
}
