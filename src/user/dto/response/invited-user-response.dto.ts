import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class InvitedUserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

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
    description: 'The company ID the user belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  currentCompanyId: Types.ObjectId

  @ApiProperty({
    description: 'User language preference',
    example: 'en',
    required: false,
  })
  lang?: string

  @ApiProperty({
    description: 'Whether this is a personal account',
    example: false,
    required: false,
  })
  personal?: boolean

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
}
