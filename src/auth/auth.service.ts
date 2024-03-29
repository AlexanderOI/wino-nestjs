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
    console.log(existingUserByEmail)

    if (existingUserByEmail)
      throw new ConflictException(`A user with email: ${email} already exists`)

    const existsUserByName = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (existsUserByName)
      throw new ConflictException(`A user with username: ${username} already exists`)

    const user = await this.prisma.user.create({
      data: userToCreate,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile: true,
        lang: true,
        role_type: true,
      },
    })

    return user
  }

  async login(userLogin: LoginAuthDto) {
    const { username, password } = userLogin
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    })

    if (!user) throw new NotFoundException('User does not exist')

    const checkPassword = await compare(password, user.password)
    if (!checkPassword) throw new UnauthorizedException('Incorrect password, try again')

    delete user.password
    delete user.id

    const payload = { name: user.name }
    const token = await this.jwtAuthService.signAsync(payload)

    const data = {
      user: user,
      token: token,
    }
    return data
  }
}
