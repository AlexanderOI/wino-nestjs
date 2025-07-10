import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class TaskOrderDto {
  @ApiProperty({
    description: 'The ID of the task',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    description: 'The new order/position for the task',
    example: 1000,
  })
  @IsNumber()
  order: number
}

export class ReorderTasksDto {
  @ApiProperty({
    description: 'Array of task orders to update',
    type: [TaskOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskOrderDto)
  taskOrders: TaskOrderDto[]
}
