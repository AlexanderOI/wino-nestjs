import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { FieldDto } from '../request/create-forms-task.dto'

export class CreateFormsTaskResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the form task',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the form task',
    example: 'Project Requirements Form',
  })
  name: string

  @ApiProperty({
    description: 'Array of fields that compose the form',
    type: [FieldDto],
  })
  fields: FieldDto[]

  @ApiProperty({
    description: 'Company ID that owns the form task',
    example: '507f1f77bcf86cd799439011',
  })
  companyId: string

  @ApiProperty({
    description: 'Whether the form task is assigned to a project',
    example: false,
  })
  hasProject: boolean

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
