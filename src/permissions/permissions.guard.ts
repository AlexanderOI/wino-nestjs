import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserInterface } from 'types'
import { PERMISSIONS_KEY } from './constants/permissions'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions: string[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!permissions) {
      return true
    }

    const user = context.switchToHttp().getRequest()

    return permissions.some((permission) =>
      user.permissions?.includes(permission),
    )
  }
}
