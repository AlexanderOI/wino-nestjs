import { ApiProperty } from '@nestjs/swagger'
import { CreateProjectResponseDto } from './create-project-response.dto'

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'User avatar URL',
    example: 'avatar.jpg',
    required: false,
  })
  avatar?: string

  @ApiProperty({
    description: 'User avatar color',
    example: '#ff0000',
    required: false,
  })
  avatarColor?: string
}

export class ProjectWithMembersResponseDto extends CreateProjectResponseDto {
  @ApiProperty({
    description: 'Array of project members with their information',
    type: [UserInfoDto],
  })
  members: UserInfoDto[]

  @ApiProperty({
    description: 'Project leader information',
    type: UserInfoDto,
  })
  leader: UserInfoDto
}

export class ProjectListResponseDto {
  @ApiProperty({
    description: 'Array of projects with members and leader information',
    type: [ProjectWithMembersResponseDto],
  })
  projects: ProjectWithMembersResponseDto[]
}
