import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hash } from 'bcrypt'

import { User } from '@/models/user.model'
import { permissions } from '@/permissions/constants/permissions'
import { Permission } from '@/models/permission.model'
import { Role } from '@/models/role.model'
import { Company } from '@/models/company.model'
import { UserCompany } from '@/models/user-company.model'
import { initialUsers, initialRoles, initialCompany } from './data.seed'

@Injectable()
export class DataService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,
    @InjectModel(UserCompany.name)
    private readonly userCompanyModel: Model<UserCompany>,
  ) {}

  async create() {
    await this.deleteAll()
    const createdPermissions = await this.insertPermissions()
    const company = await this.insertCompany()
    const roles = await this.insertRoles(createdPermissions)
    await this.insertUsers(company, roles)

    return { message: 'Datos iniciales creados exitosamente' }
  }

  private async insertPermissions() {
    const createdPermissions = await this.permissionModel.insertMany(permissions)
    return createdPermissions
  }

  private async insertCompany() {
    const company = await this.companyModel.create(initialCompany)
    return company
  }

  private async insertRoles(permissions: Permission[]) {
    const permissionIds = permissions.map((permission) => permission._id)

    const rolesWithPermissions = initialRoles.map((role) => ({
      ...role,
      permissions: permissionIds,
    }))

    const roles = (await this.roleModel.insertMany(
      rolesWithPermissions,
    )) as unknown as Role[]
    return roles
  }

  private async insertUsers(company: Company, roles: Role[]) {
    for (const userData of initialUsers) {
      const hashedPassword = await hash(userData.password, 10)

      const role = roles[userData.roleType === 'admin' ? 0 : 1]

      const user = await this.userModel.create({
        ...userData,
        password: hashedPassword,
        currentCompanyId: company._id,
      })

      const userCompany = await this.userCompanyModel.create({
        user: user._id,
        company: company._id,
        roles: [role._id],
        roleType: userData.roleType,
        createdBy: user._id,
      })

      await this.companyModel.findByIdAndUpdate(company._id, {
        $push: {
          usersCompany: userCompany._id,
          roles: role._id,
        },
        owner: userData.roleType === 'admin' ? user._id : company.owner,
      })
    }
  }

  async deleteAll() {
    await Promise.all([
      this.userModel.deleteMany({}),
      this.permissionModel.deleteMany({}),
      this.roleModel.deleteMany({}),
      this.companyModel.deleteMany({}),
      this.userCompanyModel.deleteMany({}),
    ])
  }
}
