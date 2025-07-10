import { ApiProperty } from '@nestjs/swagger'
import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform, Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsDate } from 'class-validator'
import { ObjectId } from 'mongoose'

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Mobile App Development',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'The unique code of the project',
    example: 'PROJ-001',
  })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({
    description: 'The description of the project',
    example: 'Development of a mobile application for e-commerce',
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'The ID of the project leader',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  leaderId: ObjectId

  @ApiProperty({
    description: 'The client name for the project',
    example: 'Tech Solutions Inc.',
  })
  @IsNotEmpty()
  @IsString()
  client: string

  @ApiProperty({
    description: 'The status of the project',
    example: 'active',
  })
  @IsNotEmpty()
  @IsString()
  status: string

  @ApiProperty({
    description: 'The start date of the project',
    example: '2023-12-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date

  @ApiProperty({
    description: 'The end date of the project',
    example: '2024-06-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date
}
