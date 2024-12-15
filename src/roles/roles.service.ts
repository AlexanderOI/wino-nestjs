import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { UserInterface } from 'types'
import { Role } from '../models/role.model'
import { toObjectId } from '@/common/transformer.mongo-id'
import { Company } from '@/models/company.model'

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
  ) {}

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id)

    if (!role) throw new BadRequestException('Role not found')

    return role
  }

  async create(createRoleDto: CreateRoleDto, user: UserInterface): Promise<Role> {
    const permissions = toObjectId(createRoleDto.permissions)
    const role = await this.roleModel.create({
      ...createRoleDto,
      createdBy: user.id,
      permissions,
    })

    await this.companyModel.updateOne(
      { _id: user.companyId },
      { $push: { roles: role._id } },
    )

    return role
  }

  async findAll(companyId: string): Promise<Role[]> {
    const company = await this.companyModel.findById(companyId)

    return await this.roleModel.find({ _id: { $in: company.roles } })
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

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    user: UserInterface,
  ): Promise<Role> {
    const role = await this.findOne(id)
    const permissions = toObjectId(updateRoleDto.permissions)

    const updatedRole = role.updateOne(
      { ...updateRoleDto, permissions, updatedBy: user.id },
      { new: true },
    )

    return updatedRole
  }

  async remove(id: string): Promise<Role> {
    const role = await this.findOne(id)

    const deletedRole = await role.deleteOne()

    return deletedRole
  }
}
