import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class CreateProjectResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the project',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the project',
    example: 'Mobile App Development',
  })
  name: string

  @ApiProperty({
    description: 'The unique code of the project',
    example: 'PROJ',
  })
  code: string

  @ApiProperty({
    description: 'The description of the project',
    example: 'Development of a mobile application for e-commerce',
  })
  description: string

  @ApiProperty({
    description: 'The ID of the project leader',
    example: '507f1f77bcf86cd799439011',
  })
  leaderId: Types.ObjectId

  @ApiProperty({
    description: 'Array of member IDs assigned to the project',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  membersId: Types.ObjectId[]

  @ApiProperty({
    description: 'The client name for the project',
    example: 'Tech Solutions Inc.',
  })
  client: string

  @ApiProperty({
    description: 'The status of the project',
    example: 'active',
  })
  status: string

  @ApiProperty({
    description: 'The ID of the form task associated with the project',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  formTaskId?: Types.ObjectId

  @ApiProperty({
    description: 'The start date of the project',
    example: '2023-12-01T00:00:00.000Z',
  })
  startDate: Date

  @ApiProperty({
    description: 'The end date of the project',
    example: '2024-06-01T00:00:00.000Z',
  })
  endDate: Date

  @ApiProperty({
    description: 'Company ID that owns the project',
    example: '507f1f77bcf86cd799439011',
  })
  companyId: Types.ObjectId

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date
}
