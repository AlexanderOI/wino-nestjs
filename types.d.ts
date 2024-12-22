import { Request } from 'express'
import { User } from '@prisma/client'

export interface RequestWithUser extends Request {
  user: UserAuth
}

export interface UserAuth {
  _id: string
  name: string
  userName: string
  email: string
  createdAt: string
  updatedAt: string
  companyId: string
  companyName: string
  permissions: string[]
  exp: number
  iat: number
}
