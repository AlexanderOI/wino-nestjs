import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Permission } from './entities/permission.entity'
import { Model } from 'mongoose'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissioModel: Model<Permission>,
  ) {}

  async findAll() {
    const roles = await this.permissioModel.find().select('name description')

    return roles
  }

  async search(query: string): Promise<Permission[]> {
    if (!query.trim()) {
      throw new BadRequestException('Query must not be empty')
    }

    const roles = await this.permissioModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      })
      .select('name description')

    return roles
  }
}
