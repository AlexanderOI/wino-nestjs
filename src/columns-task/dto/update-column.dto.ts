import { IsOptional, IsNumber } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { CreateColumnTaskDto } from './create-column.dto'

export class UpdateColumnTaskDto extends PartialType(CreateColumnTaskDto) {
  @IsNumber()
  @IsOptional()
  order?: number
}
