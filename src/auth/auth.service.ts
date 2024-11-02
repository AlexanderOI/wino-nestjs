import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { hash, compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './entities/user.entity'
import { Model } from 'mongoose'
import { Company } from 'src/company/entities/company.entity'
import { Role } from 'src/roles/entities/role.entity'
import { Permission } from 'src/permissions/entities/permission.entity'

@Injectable()
export class AuthService {
  constructor(
    private jwtAuthService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private readonly permissioModel: Model<Permission>,
  ) {}

  async register(userRegister: RegisterAuthDto) {
    const { password, email, userName } = userRegister
    const passwordHash = await hash(password, 10)
    const userToCreate = { ...userRegister, password: passwordHash }

    const existingUserByEmail = await this.userModel.findOne({ email })

    if (existingUserByEmail)
      throw new ConflictException(`A user with email: ${email} already exists`)

    const existsUserByName = await this.userModel.findOne({
      userName: userName,
    })

    if (existsUserByName) {
      throw new ConflictException(
        `A user with username: ${userName} already exists`,
      )
    }

    const company = await this.companyModel.create({
      name: 'Default Company' + Math.floor(Math.random() * 1000),
      description: 'Default company for new users',
    })

    const permissions = await this.permissioModel.find()

    const role = await this.roleModel.create({
      name: 'Admin',
      description: 'Admin role for new users',
      companyId: company._id,
      permissions: permissions.map((permission) => permission._id),
    })

    const user = await this.userModel.create({
      ...userToCreate,
      companies: [
        { companyId: company._id, roles: [role._id], roleType: 'Admin' },
      ],
    })

    return { message: 'User registered successfully' }
  }

  async login(userLogin: LoginAuthDto) {
    const { userName, password } = userLogin

    const user = await this.userModel
      .findOne({ userName })
      .populate({
        path: 'companies',
        populate: {
          path: 'roles',
          select: 'name permissions',
          populate: {
            path: 'permissions',
            model: 'Permission',
            select: 'name',
          },
        },
      })
      .lean()

    if (!user) throw new NotFoundException('User does not exist')

    const checkPassword = await compare(password, user.password)
    if (!checkPassword)
      throw new UnauthorizedException('Incorrect password, try again')

    const permissions = user.companies[0].roles
      .map((role) => role.permissions.map((permission) => permission.name))
      .flat()

    const payload = { id: user._id, userName: user.userName, permissions }
    const token = await this.jwtAuthService.signAsync(payload)

    delete user.password
    delete user.id

    const data = {
      userName: user.userName,
      email: user.email,
      roleType: user.companies[0].roleType,
      token: token,
      permissions: permissions,
    }

    return data
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'companies.roles',
        populate: {
          path: 'permissions',
          select: 'name',
        },
      })
      .exec()

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Obtener todos los permisos de todas las compañías del usuario
    const permissions = new Set<string>()
    user.companies.forEach((companyRole) => {
      companyRole.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          permissions.add(permission.name)
        })
      })
    })

    return Array.from(permissions)
  }
}
