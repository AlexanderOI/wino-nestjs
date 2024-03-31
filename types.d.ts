import { Request } from 'express'
import { User } from '@prisma/client'

export interface RequestWithUser extends Request {
  user: UserInterface
}

export interface UserWithPermission extends User {
  permission?: string[]
}

interface UserInterface {
  id: int
  username: string
  permissions: string[]
}
