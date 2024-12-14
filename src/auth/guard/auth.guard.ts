import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { Types } from 'mongoose'
import { UserInterface } from 'types'

@Injectable()
export class AuthGuardJwt implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const token = this.extractTokenFromHeader(request)
    if (!token) throw new UnauthorizedException()

    try {
      const payload: UserInterface = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_ACCESS,
      })

      let user = {
        ...payload,
        companyId: new Types.ObjectId(payload.companyId),
        id: new Types.ObjectId(payload.id),
      }
      request.user = user
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
