import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Permissions } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'

export function Auth(...permissions: string[]) {
  return applyDecorators(Permissions(permissions), UseGuards(AuthGuard, PermissionsGuard))
}
