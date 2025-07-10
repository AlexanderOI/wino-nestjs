import { ApiProperty } from '@nestjs/swagger'

export class DeleteRoleResponseDto {
  @ApiProperty({
    description: 'Success message for role deletion',
    example: 'Role deleted successfully',
  })
  message: string

  @ApiProperty({
    description: 'The unique identifier of the deleted role',
    example: '507f1f77bcf86cd799439011',
  })
  deletedId: string
}
