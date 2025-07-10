import { ApiProperty } from '@nestjs/swagger'
import { RoleResponseDto } from './role-response.dto'

export class SearchRolesResponseDto {
  @ApiProperty({
    description: 'Array of roles matching the search criteria',
    type: [RoleResponseDto],
  })
  roles: RoleResponseDto[]

  @ApiProperty({
    description: 'Number of roles found',
    example: 3,
  })
  count: number

  @ApiProperty({
    description: 'The search term used',
    example: 'manager',
  })
  query: string
}
