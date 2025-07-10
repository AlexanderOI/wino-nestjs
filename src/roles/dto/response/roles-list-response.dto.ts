import { ApiProperty } from '@nestjs/swagger'
import { RoleResponseDto } from './role-response.dto'

export class RolesListResponseDto {
  @ApiProperty({
    description: 'Array of roles',
    type: [RoleResponseDto],
  })
  roles: RoleResponseDto[]

  @ApiProperty({
    description: 'Total number of roles',
    example: 5,
  })
  total: number
}
