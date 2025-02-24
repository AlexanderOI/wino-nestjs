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

import { User, UserDocument } from '../models/user.model'
import { Company, CompanyDocument } from '@/models/company.model'
import { Role } from '@/models/role.model'
import { Permission } from '@/models/permission.model'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'

import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { UserAuth } from 'types'
import { UserPayload } from './interfaces/user-payload'
import { toObjectId } from '@/common/transformer.mongo-id'

@Injectable()
export class AuthService {
  constructor(
    private jwtAuthService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name) private readonly permissioModel: Model<Permission>,
    @InjectModel(UserCompany.name)
    private readonly userCompanyModel: Model<UserCompanyDocument>,
  ) {}

  async register(userRegister: RegisterAuthDto) {
    const { password, email, userName } = userRegister
    const passwordHash = await hash(password, 10)
    const userToCreate = { ...userRegister, password: passwordHash }

    const existingUserByEmail = await this.userModel.findOne({ email })

    if (existingUserByEmail) {
      throw new ConflictException({
        email: [`A user with email: ${email} already exists`],
      })
    }

    const existsUserByName = await this.userModel.findOne({ userName: userName })

    if (existsUserByName) {
      throw new ConflictException({
        userName: [`A user with username: ${userName} already exists`],
      })
    }

    const user = await this.userModel.create({
      ...userToCreate,
    })

    const permissions = await this.permissioModel.find()

    const role = await this.roleModel.create({
      name: 'Admin',
      description: 'Admin role for new users',
      permissions: permissions.map((permission) => permission._id),
    })

    const company = await this.companyModel.create({
      name: userName + '_Company',
      description: 'Default company for new users',
      isMain: true,
      owner: user._id,
      rolesId: [role._id],
    })

    const userCompany = await this.userCompanyModel.create({
      userId: user._id,
      companyId: company._id,
      roleType: 'admin',
      rolesId: [role._id],
    })

    await company.updateOne({ usersCompany: [userCompany._id] })
    await user.updateOne({ currentCompanyId: company._id })

    return { message: 'User registered successfully' }
  }

  async login(userLogin: LoginAuthDto) {
    const { userName, password } = userLogin

    const user = await this.userModel.findOne({ userName }).lean()

    if (!user) throw new NotFoundException('User does not exist')

    const checkPassword = await compare(password, user.password)
    if (!checkPassword) throw new UnauthorizedException('Incorrect password, try again')

    const payload = await this.createUserPayload(user._id.toString())

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

  async refreshToken(user: UserAuth) {
    const payload = await this.createUserPayload(user._id.toString())

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

  async checkUserData(userName?: string, email?: string) {
    if (userName) {
      const user = await this.userModel.findOne({ userName })
      if (user) throw new ConflictException('User already exists')
    }

    if (email) {
      const userByEmail = await this.userModel.findOne({ email })
      if (userByEmail) throw new ConflictException('Email already exists')
    }

    return { message: 'User data is valid' }
  }

  async createUserPayload(userId: string): Promise<UserPayload> {
    const user = await this.userModel.findOne({ _id: toObjectId(userId) }).populate({
      path: 'currentCompany',
      select: 'name address rolesId',
    })

    let userCompany = await this.getUserCompany(user._id, user.currentCompany._id)

    if (!userCompany.isActive) {
      let companyOwner = await this.companyModel.findOne({
        owner: user._id,
        isMain: true,
      })

      await user.updateOne({ currentCompanyId: companyOwner._id })

      userCompany = await this.getUserCompany(user._id, companyOwner._id)
    }

    const permissions = userCompany.roles.flatMap((role) =>
      role.permissions?.map((permission) => permission.name),
    )

    const company = user.currentCompany

    const { name, userName, email, _id, avatar } = user

    const userDataPayload = {
      _id: _id.toString(),
      name,
      userName,
      email,
      avatar,
      roleType: userCompany.roleType,
      companyId: company._id.toString(),
      companyName: company.name.toString(),
      companyAddress: company.address?.toString(),
      permissions,
    }

    return userDataPayload
  }

  async getUserCompany(userId: unknown, companyId: unknown) {
    const userCompany = await this.userCompanyModel
      .findOne({ userId, companyId })
      .populate({
        path: 'roles',
        select: 'name permissions',
        populate: {
          path: 'permissions',
          model: 'Permission',
          select: 'name',
        },
      })
      .lean()

    return userCompany
  }
}
