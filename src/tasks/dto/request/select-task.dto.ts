import { IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SelectTaskDto {
  @ApiProperty({
    description: 'Whether to exclude fields from the response',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  fields?: boolean

  @ApiProperty({
    description: 'Whether to exclude comments from the response',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  comments?: boolean
}
