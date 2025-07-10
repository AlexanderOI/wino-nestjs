import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateFormsTaskDto, FieldDto } from './create-forms-task.dto'

export class UpdateFormsTaskDto extends PartialType(CreateFormsTaskDto) {
  @ApiProperty({
    description: 'The name of the form task',
    example: 'Updated Project Requirements Form',
    required: false,
  })
  name?: string

  @ApiProperty({
    description: 'Array of fields that compose the form',
    type: [FieldDto],
    required: false,
  })
  fields?: FieldDto[]
}
