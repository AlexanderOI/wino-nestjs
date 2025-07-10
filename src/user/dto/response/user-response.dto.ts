import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  userName: string

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'URL of the user avatar image',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string

  @ApiProperty({
    description: 'Avatar color for the user',
    example: '#52555E',
  })
  avatarColor: string

  @ApiProperty({
    description: 'Array of role names assigned to the user',
    example: ['Admin', 'Project Manager'],
    type: [String],
  })
  roles: string[]

  @ApiProperty({
    description: 'Array of role IDs assigned to the user',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  rolesId: string[]

  @ApiProperty({
    description: 'Role type classification for the user',
    example: 'admin',
  })
  roleType: string

  @ApiProperty({
    description: 'Whether the user is active in the company',
    example: true,
  })
  isActive: boolean

  @ApiProperty({
    description: 'Whether the user was invited to the company',
    example: false,
  })
  isInvited: boolean

  @ApiProperty({
    description: 'Whether the user has a pending invitation',
    example: false,
  })
  invitePending: boolean

  @ApiProperty({
    description: 'The company ID the user belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  company: string

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
