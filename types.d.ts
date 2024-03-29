import { Request } from 'express'

export interface RequestWithUser extends Request {
  user: UserInterface
}

interface UserInterface {
  name: string
  permissions: string[]
}
