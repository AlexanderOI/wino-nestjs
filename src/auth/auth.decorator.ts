import { UseGuards, applyDecorators } from '@nestjs/common'
import { Permissions } from 'src/permissions/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { AuthGuardJwt } from './auth.guard'

export function Auth(...permissions: string[]) {
  return applyDecorators(
    Permissions(permissions),
    UseGuards(AuthGuardJwt, PermissionsGuard),
  )
}
