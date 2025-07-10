import { ApiProperty } from '@nestjs/swagger'
import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsNumber } from 'class-validator'

import { CreateColumnDto } from './create-column.dto'

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  @ApiProperty({
    description: 'The order of the column',
    example: 1000,
  })
  @IsNumber()
  @IsOptional()
  order?: number
}
