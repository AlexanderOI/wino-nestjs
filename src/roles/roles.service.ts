import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { UserInterface } from 'types'
import { Role } from './entities/role.entity'
import { log } from 'console'

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async find(id: string): Promise<Role> {
    const role = await this.roleModel
      .findOne({ _id: id })
      .select('name description')

    if (!role) throw new BadRequestException('Role not found')

    return role
  }

  async create(
    createRoleDto: CreateRoleDto,
    user: UserInterface,
  ): Promise<Role> {
    const role = await this.roleModel.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      companyId: user.companyId,
      createdBy: user.id,
    })

    return role
  }

  async findAll(companyId: string): Promise<Role[]> {
    const roles = await this.roleModel
      .find({ companyId })
      .select('name description')

    return roles
  }

  async search(query: string): Promise<Role[]> {
    if (!query.trim()) {
      throw new BadRequestException('Query must not be empty')
    }
    const roles = await this.roleModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    })

    return roles
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.find(id)

    const updatedRole = role.updateOne(updateRoleDto, { new: true })

    return updatedRole
  }

  async remove(id: string): Promise<Role> {
    const role = await this.find(id)

    const deletedRole = await role.deleteOne()

    return deletedRole
  }
}
