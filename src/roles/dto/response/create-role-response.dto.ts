import { ApiProperty } from '@nestjs/swagger'
import { RoleResponseDto } from './role-response.dto'

export class CreateRoleResponseDto extends RoleResponseDto {
  @ApiProperty({
    description: 'Success message for role creation',
    example: 'Role created successfully',
  })
  message?: string
}
