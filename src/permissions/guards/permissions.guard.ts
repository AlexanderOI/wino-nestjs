import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../constants/permissions'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions: string[] = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!permissions || permissions.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    return permissions.some((permission) => user?.permissions?.includes(permission))
  }
}
