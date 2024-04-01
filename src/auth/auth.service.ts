import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { hash, compare } from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { UserWithPermission } from 'types'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtAuthService: JwtService,
  ) {}

  async register(userRegister: RegisterAuthDto) {
    const { password, email, username } = userRegister
    const passwordHash = await hash(password, 10)
    const userToCreate = { ...userRegister, password: passwordHash }

    const existingUserByEmail = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUserByEmail)
      throw new ConflictException(`A user with email: ${email} already exists`)

    const existsUserByName = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (existsUserByName)
      throw new ConflictException(
        `A user with username: ${username} already exists`,
      )

    const user = await this.prisma.user.create({
      data: userToCreate,
    })

    return true
  }

  async login(userLogin: LoginAuthDto) {
    const { username, password } = userLogin
    const user: UserWithPermission = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (!user) throw new NotFoundException('User does not exist')

    const checkPassword = await compare(password, user.password)
    if (!checkPassword)
      throw new UnauthorizedException('Incorrect password, try again')

    const permission = await this.getUserPermissions(user.id)
    user.permission = permission

    const payload = { id: user.id, username: user.username }
    const token = await this.jwtAuthService.signAsync(payload)

    delete user.password
    delete user.id

    const data = {
      name: user.name,
      username: user.username,
      email: user.email,
      profile: user.profile,
      lang: user.lang,
      role_type: user.role_type,
      token: token,
    }

    return data
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        UserRoles: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        RoleOnPermission: {
          include: {
            permission: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const permissions: string[] = []

    roles.forEach((role) => {
      role.RoleOnPermission.forEach((rolePermission) => {
        permissions.push(rolePermission.permission.name)
      })
    })

    return permissions
  }
}
