import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform, Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { JSONContentNode } from '@/common/json-content.dto'

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the task',
    example: 'Implement user authentication',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Rich text description of the task in JSON format',
    example: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This task involves implementing JWT authentication for the application',
            },
          ],
        },
      ],
    },
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => JSONContentNode)
  description?: JSONContentNode

  @ApiProperty({
    description: 'The ID of the user assigned to this task',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  assignedToId?: Types.ObjectId

  @ApiProperty({
    description: 'The order/position of the task within its column',
    example: 1000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order?: number

  @ApiProperty({
    description: 'The ID of the column where this task will be placed',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  columnId: Types.ObjectId

  @ApiProperty({
    description: 'The ID of the project this task belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  projectId: Types.ObjectId
}
