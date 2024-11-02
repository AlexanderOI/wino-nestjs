import { UseGuards, applyDecorators } from '@nestjs/common'
import { Permissions } from 'src/permissions/decorators/permissions.decorator'
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard'
import { AuthGuardJwt } from './auth.guard'

export function Auth(...permissions: string[]) {
  return applyDecorators(
    Permissions(permissions),
    UseGuards(AuthGuardJwt, PermissionsGuard),
  )
}
