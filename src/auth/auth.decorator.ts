import { UseGuards, applyDecorators } from '@nestjs/common'
import { Permissions } from '@/permissions/decorators/permissions.decorator'
import { PermissionsGuard } from '@/permissions/guards/permissions.guard'
import { AuthGuardJwt } from './guard/auth.guard'

export function Auth(...permissions: string[]) {
  return applyDecorators(
    Permissions(permissions),
    UseGuards(AuthGuardJwt, PermissionsGuard),
  )
}
