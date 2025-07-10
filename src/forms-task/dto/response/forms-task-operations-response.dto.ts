import { ApiProperty } from '@nestjs/swagger'
import { CreateFormsTaskResponseDto } from './create-forms-task-response.dto'

export class DuplicateFormsTaskResponseDto extends CreateFormsTaskResponseDto {
  @ApiProperty({
    description: 'The name of the duplicated form task (includes "duplicated" suffix)',
    example: 'Project Requirements Form (duplicated)',
  })
  name: string
}

export class DeleteFormsTaskResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'FormTask deleted successfully',
  })
  message: string
}

export class AssignFormTaskResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'FormTask assigned to project successfully',
  })
  message: string
}
