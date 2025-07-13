import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateProjectDto } from './create-project.dto'

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Mobile App Development - Updated',
    required: false,
  })
  name?: string

  @ApiProperty({
    description: 'The unique code of the project',
    example: 'PROJ-001-V2',
    required: false,
  })
  code?: string

  @ApiProperty({
    description: 'The description of the project',
    example: 'Updated development of a mobile application for e-commerce',
    required: false,
  })
  description?: string

  @ApiProperty({
    description: 'The color of the project',
    example: '#0000FF',
    required: false,
  })
  color?: string

  @ApiProperty({
    description: 'The ID of the project leader',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  leaderId?: any

  @ApiProperty({
    description: 'The client name for the project',
    example: 'Tech Solutions Inc. - Updated',
    required: false,
  })
  client?: string

  @ApiProperty({
    description: 'The status of the project',
    example: 'completed',
    enum: ['active', 'inactive', 'completed', 'on-hold'],
    required: false,
  })
  status?: string

  @ApiProperty({
    description: 'The start date of the project',
    example: '2023-12-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  startDate?: Date

  @ApiProperty({
    description: 'The end date of the project',
    example: '2024-08-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  endDate?: Date
}
