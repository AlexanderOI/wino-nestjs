import { hash, compare } from 'bcrypt'
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'

import { User } from './entities/user.entity'
import { Company } from 'src/company/entities/company.entity'
import { Role } from 'src/roles/entities/role.entity'
import { Permission } from 'src/permissions/entities/permission.entity'

import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { UserInterface } from 'types'

@Injectable()
export class AuthService {
  constructor(
    private jwtAuthService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name) private readonly permissioModel: Model<Permission>,
  ) {}

  async register(userRegister: RegisterAuthDto) {
    const { password, email, userName } = userRegister
    const passwordHash = await hash(password, 10)
    const userToCreate = { ...userRegister, password: passwordHash }

    const existingUserByEmail = await this.userModel.findOne({ email })

    if (existingUserByEmail) {
      throw new ConflictException(`A user with email: ${email} already exists`)
    }

    const existsUserByName = await this.userModel.findOne({
      userName: userName,
    })

    if (existsUserByName) {
      throw new ConflictException(`A user with username: ${userName} already exists`)
    }

    const user = await this.userModel.create({
      ...userToCreate,
    })

    const permissions = await this.permissioModel.find()

    const role = await this.roleModel.create({
      name: 'Admin',
      description: 'Admin role for new users',
      permissions: permissions.map((permission) => permission._id),
      createdBy: user._id,
    })

    const company = await this.companyModel.create({
      name: 'Default Company' + Math.floor(Math.random() * 1000),
      description: 'Default company for new users',
      isMain: true,
      owner: user._id,
      createdBy: user._id,
      roles: [role._id],
    })

    await user.updateOne({ currentCompanyId: company._id })

    return { message: 'User registered successfully' }
  }

  async login(userLogin: LoginAuthDto) {
    const { userName, password } = userLogin

    const user = await this.userModel.findOne({ userName }).lean()

    if (!user) throw new NotFoundException('User does not exist')

    const checkPassword = await compare(password, user.password)
    if (!checkPassword) throw new UnauthorizedException('Incorrect password, try again')

    const payload = await this.createUserPayload(userName)

    return {
      user: payload,
      backendTokens: {
        accessToken: await this.jwtAuthService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET_ACCESS,
        }),
        refreshToken: await this.jwtAuthService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET_REFRESH,
        }),
        expiresIn: new Date().getTime() + 60 * 60 * 1000,
      },
    }
  }

  async refreshToken(user: UserInterface) {
    const payload = await this.createUserPayload(user.userName)

    return {
      accessToken: await this.jwtAuthService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_ACCESS,
      }),
      refreshToken: await this.jwtAuthService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET_REFRESH,
      }),
      expiresIn: new Date().getTime() + 60 * 60 * 1000,
    }
  }

  async createUserPayload(userName: string) {
    const populatedUser = await this.userModel
      .findOne({ userName })
      .populate({
        path: 'currentCompanyId',
        select: 'name address roles',
        populate: {
          path: 'roles',
          model: 'Role',
          select: 'name permissions',
          populate: {
            path: 'permissions',
            model: 'Permission',
            select: 'name',
          },
        },
      })
      .lean()

    const permissions = populatedUser.currentCompanyId.roles
      .map((role) => role.permissions.map((permission) => permission.name))
      .flat()

    const company = populatedUser.currentCompanyId

    const { password: _, _id, __v, ...userData } = populatedUser

    delete userData.currentCompanyId

    const userDataPayload = {
      ...userData,
      id: _id,
      companyId: company._id,
      companyName: company.name,
      companyAddress: company.address,
      permissions,
    }

    return userDataPayload
  }
}
