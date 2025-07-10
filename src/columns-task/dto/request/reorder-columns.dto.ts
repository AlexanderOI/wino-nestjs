import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class ColumnOrderDto {
  @ApiProperty({
    description: 'The ID of the column',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    description: 'The new order of the column',
    example: 1000,
  })
  @IsNumber()
  order: number
}

export class ReorderColumnsDto {
  @ApiProperty({
    description: 'Array of column orders',
    type: [ColumnOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnOrderDto)
  columnOrders: ColumnOrderDto[]
}
