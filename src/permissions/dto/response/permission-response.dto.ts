import { ApiProperty } from '@nestjs/swagger'

export class PermissionResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the permission',
    type: String,
    example: '507f1f77bcf86cd799439011',
  })
  _id: string

  @ApiProperty({
    description: 'Unique name of the permission',
    example: 'VIEW_ROLE',
  })
  name: string

  @ApiProperty({
    description: 'Description of what this permission allows',
    example: 'Allows viewing roles and their details',
  })
  description: string
}
