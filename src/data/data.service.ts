import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from 'src/auth/entities/user.entity'
import { permissions } from 'src/permissions/constants/permissions'
import { Permission } from 'src/permissions/entities/permission.entity'
import { Role } from 'src/roles/entities/role.entity'

@Injectable()
export class DataService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  create() {
    this.insertPermission()
  }

  async insertPermission() {
    await this.permissionModel.insertMany(permissions)
  }

  deleteAll() {
    this.permissionModel.deleteMany({}).exec()
  }
}
