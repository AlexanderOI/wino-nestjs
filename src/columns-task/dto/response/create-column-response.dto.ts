import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class CreateColumnResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the column',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the column',
    example: 'In Progress',
  })
  name: string

  @ApiProperty({
    description: 'The order of the column',
    example: 1000,
  })
  order: number

  @ApiProperty({
    description: 'The color of the column in hex format',
    example: '#ffff00',
  })
  color: string

  @ApiProperty({
    description: 'Whether the column is completed',
    example: false,
  })
  completed: boolean

  @ApiProperty({
    description: 'Company ID that owns the column',
    example: '507f1f77bcf86cd799439011',
  })
  companyId: Types.ObjectId

  @ApiProperty({
    description: 'Project ID that contains the column',
    example: '507f1f77bcf86cd799439011',
  })
  projectId: Types.ObjectId

  @ApiProperty({
    description: 'Whether the column is active',
    example: true,
  })
  isActive: boolean

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
