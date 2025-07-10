import { ApiProperty } from '@nestjs/swagger'
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

export class FieldOptionDto {
  @ApiProperty({
    description: 'The display value of the option',
    example: 'High Priority',
  })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiProperty({
    description: 'The order of the option in the list',
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  order: number
}

export class FieldDto {
  @ApiProperty({
    description: 'The label of the field',
    example: 'Task Priority',
  })
  @IsString()
  @IsNotEmpty()
  label: string

  @ApiProperty({
    description: 'The placeholder text for the field',
    example: 'Select task priority',
    required: false,
  })
  @IsString()
  @IsOptional()
  placeholder?: string

  @ApiProperty({
    description: 'The type of the field',
    enum: FieldType,
    example: FieldType.Select,
    enumName: 'FieldType',
  })
  @IsEnum(FieldType)
  @IsNotEmpty()
  type: FieldType

  @ApiProperty({
    description: 'Array of options for select fields',
    type: [FieldOptionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOptionDto)
  @IsOptional()
  options?: FieldOptionDto[]

  @ApiProperty({
    description: 'The order of the field in the form',
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  order: number
}

export class CreateFormsTaskDto {
  @ApiProperty({
    description: 'The name of the form task',
    example: 'Project Requirements Form',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Array of fields that compose the form',
    type: [FieldDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  @IsNotEmpty()
  fields: FieldDto[]
}
