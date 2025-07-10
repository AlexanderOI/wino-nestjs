import { ApiProperty } from '@nestjs/swagger'
import { CreateProjectResponseDto } from './create-project-response.dto'

export class DeleteProjectResponseDto extends CreateProjectResponseDto {
  @ApiProperty({
    description: 'Confirmation message',
    example: 'Project deleted successfully',
  })
  message?: string
}

export class SetProjectUsersResponseDto {
  @ApiProperty({
    description: 'Array of member IDs assigned to the project',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  membersId: string[]

  @ApiProperty({
    description: 'Success message',
    example: 'Project members updated successfully',
  })
  message: string
}
