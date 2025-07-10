import { ApiProperty } from '@nestjs/swagger'
import { PermissionResponseDto } from './permission-response.dto'

export class SearchPermissionsResponseDto {
  @ApiProperty({
    description: 'List of permissions that match the search criteria',
    type: [PermissionResponseDto],
    isArray: true,
  })
  permissions: PermissionResponseDto[]

  @ApiProperty({
    description: 'The search term that was used',
    example: 'view',
  })
  searchTerm: string

  @ApiProperty({
    description: 'Number of permissions found',
    example: 5,
  })
  count: number
}
