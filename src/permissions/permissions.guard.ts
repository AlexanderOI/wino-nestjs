import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserInterface } from 'types'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions: string[] = this.reflector.getAllAndOverride('permissions', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!permissions) {
      return true
    }

    const { user }: { user: UserInterface } = context.switchToHttp().getResponse()

    return permissions.some((permission) => user.permissions?.includes(permission))
  }
}
