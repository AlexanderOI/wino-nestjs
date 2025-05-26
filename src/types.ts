import { Types } from 'mongoose'

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserAuth
  }
}

export interface UserAuth {
  _id: Types.ObjectId
  name: string
  userName: string
  email: string
  createdAt: string
  updatedAt: string
  companyId: string | Types.ObjectId
  companyName: string
  permissions: string[]
  exp: number
  iat: number
}
