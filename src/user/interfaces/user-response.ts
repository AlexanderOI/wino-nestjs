export interface UserResponse {
  _id: string
  name: string
  company: string
  userName: string
  email: string
  avatar: string
  avatarColor: string
  roles: string[]
  rolesId: string[]
  roleType: string
  isActive: boolean
  isInvited: boolean
  invitePending: boolean
  createdAt: Date
  updatedAt: Date
}
