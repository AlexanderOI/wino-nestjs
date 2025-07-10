import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'

export class PermissionInfoDto {
  @ApiProperty({
    description: 'The unique identifier of the permission',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the permission',
    example: 'VIEW_PROJECTS',
  })
  name: string

  @ApiProperty({
    description: 'A description of what this permission allows',
    example: 'Allows viewing project information',
  })
  description: string
}

export class RoleResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the role',
    example: '507f1f77bcf86cd799439011',
  })
  _id: Types.ObjectId

  @ApiProperty({
    description: 'The name of the role',
    example: 'Project Manager',
  })
  name: string

  @ApiProperty({
    description: 'A description of the role and its responsibilities',
    example: 'Manages project planning and team coordination',
  })
  description: string

  @ApiProperty({
    description: 'Array of permissions associated with this role',
    type: [PermissionInfoDto],
  })
  permissions: PermissionInfoDto[]

  @ApiProperty({
    description: 'The date when the role was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The date when the role was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
