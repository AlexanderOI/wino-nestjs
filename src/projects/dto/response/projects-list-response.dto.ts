import { ApiProperty } from '@nestjs/swagger'
import { ProjectWithMembersResponseDto } from './project-with-members-response.dto'

export class ProjectsListResponseDto {
  @ApiProperty({
    description: 'Array of projects',
    type: [ProjectWithMembersResponseDto],
  })
  projects: ProjectWithMembersResponseDto[]

  @ApiProperty({
    description: 'Total number of projects',
    example: 25,
  })
  total: number
}
