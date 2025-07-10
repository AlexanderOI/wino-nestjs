import { ApiProperty } from '@nestjs/swagger'
import { RoleResponseDto } from './role-response.dto'

export class UpdateRoleResponseDto extends RoleResponseDto {
  @ApiProperty({
    description: 'Success message for role update',
    example: 'Role updated successfully',
  })
  message?: string
}
