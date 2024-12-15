import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from '@/models/user.model'
import { permissions } from '@/permissions/constants/permissions'
import { Permission } from '@/models/permission.model'

@Injectable()
export class DataService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
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
