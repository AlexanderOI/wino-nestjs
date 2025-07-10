import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { toObjectId } from '@/common/transformer.mongo-id'

export class CreateFieldDto {
  @ApiProperty({
    description: 'The ID of the field definition from the form template',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  idField: string

  @ApiProperty({
    description: 'The value for this field',
    example: 'High',
  })
  @IsString()
  @IsNotEmpty()
  value: string
}
