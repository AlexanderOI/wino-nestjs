import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'

import { FieldType } from '@/models/form-task.model'

class FieldOptionDto {
  @IsString()
  @IsNotEmpty()
  value: string

  @IsNumber()
  @Min(0)
  order: number
}

class FieldDto {
  @IsString()
  @IsNotEmpty()
  label: string

  @IsString()
  @IsOptional()
  placeholder?: string

  @IsEnum(FieldType)
  @IsNotEmpty()
  type: FieldType

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOptionDto)
  @IsOptional()
  options?: FieldOptionDto[]

  @IsNumber()
  @Min(0)
  order: number
}

export class CreateFormsTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @IsNotEmpty()
  fields: FieldDto[]
}
