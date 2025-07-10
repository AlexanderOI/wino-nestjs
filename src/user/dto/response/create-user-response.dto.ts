import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the created user',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The full name of the created user',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'The username of the created user',
    example: 'johndoe',
  })
  userName: string

  @ApiProperty({
    description: 'The email address of the created user',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'The company ID the user belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  currentCompanyId: Types.ObjectId

  @ApiProperty({
    description: 'Avatar color assigned to the user',
    example: '#52555E',
  })
  avatarColor: string

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
