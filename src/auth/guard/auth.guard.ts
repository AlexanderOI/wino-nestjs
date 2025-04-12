import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'
import { Types } from 'mongoose'
import { UserAuth } from '@/types'

@Injectable()
export class AuthGuardJwt implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) throw new UnauthorizedException()

    try {
      const payload: UserAuth = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_ACCESS,
      })

      let user = {
        ...payload,
        companyId: new Types.ObjectId(payload.companyId),
        _id: new Types.ObjectId(payload._id),
      }
      request.user = user
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
