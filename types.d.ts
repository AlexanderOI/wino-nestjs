import { Request } from 'express'
import { User } from '@prisma/client'

export interface RequestWithUser extends Request {
  user: UserInterface
}

type UserInterface = {
  id: number
  name: string
  userName: string
  email: string
  lang: string
  roleType: string
  permission: string[]
  companyId: number
}
