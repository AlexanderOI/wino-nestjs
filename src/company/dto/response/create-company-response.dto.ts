import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class OwnerInfoDto {
  @ApiProperty({
    description: 'Owner user ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'Owner name',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'Owner avatar URL',
    example: 'avatar.jpg',
    required: false,
  })
  avatar?: string

  @ApiProperty({
    description: 'Owner avatar color',
    example: '#ff0000',
    required: false,
  })
  avatarColor?: string
}

export class CreateCompanyResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the company',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Solutions Inc.',
  })
  name: string

  @ApiProperty({
    description: 'The address of the company',
    example: '123 Tech Street, Innovation City, TC 12345',
  })
  address: string

  @ApiProperty({
    description: 'Array of role IDs associated with the company',
    type: [String],
    example: ['507f1f77bcf86cd799439011'],
  })
  rolesId: Types.ObjectId[]

  @ApiProperty({
    description: 'Information about the company owner',
    type: OwnerInfoDto,
  })
  owner: OwnerInfoDto

  @ApiProperty({
    description: 'Array of user-company relationships',
    type: [String],
    example: ['507f1f77bcf86cd799439011'],
  })
  usersCompany: Types.ObjectId[]

  @ApiProperty({
    description: 'Whether this is the main company',
    example: false,
  })
  isMain: boolean

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
