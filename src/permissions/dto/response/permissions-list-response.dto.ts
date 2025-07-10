import { ApiProperty } from '@nestjs/swagger'
import { PermissionResponseDto } from './permission-response.dto'

export class PermissionsListResponseDto {
  @ApiProperty({
    description: 'List of all available permissions in the system',
    type: [PermissionResponseDto],
    isArray: true,
  })
  permissions: PermissionResponseDto[]
}
