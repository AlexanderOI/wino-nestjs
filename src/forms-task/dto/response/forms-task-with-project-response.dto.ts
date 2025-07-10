import { ApiProperty } from '@nestjs/swagger'
import { CreateFormsTaskResponseDto } from './create-forms-task-response.dto'

export class FormsTaskWithProjectResponseDto extends CreateFormsTaskResponseDto {
  @ApiProperty({
    description: 'Name of the project associated with this form task',
    example: 'Mobile App Development',
    required: false,
  })
  projectName?: string
}

export class FormsTaskListResponseDto {
  @ApiProperty({
    description: 'Array of form tasks with project information',
    type: [FormsTaskWithProjectResponseDto],
  })
  formsTasks: FormsTaskWithProjectResponseDto[]
}

export class FormsTaskWithoutFieldsResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the form task',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string

  @ApiProperty({
    description: 'The name of the form task',
    example: 'Project Requirements Form',
  })
  name: string

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
    description: 'Name of the project associated with this form task',
    example: 'Mobile App Development',
    required: false,
  })
  projectName?: string

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
