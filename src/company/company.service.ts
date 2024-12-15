import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from '../models/company.model'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { UserInterface } from 'types'
import { Role } from '@/models/role.model'
import { Permission } from '@/models/permission.model'

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: UserInterface,
  ): Promise<Company> {
    const permissions = await this.permissionModel.find()

    const role = await this.roleModel.create({
      name: 'Admin',
      description: 'Admin role for new company',
      permissions: permissions.map((permission) => permission._id),
      createdBy: user.id,
    })

    const company = await this.companyModel.create({
      ...createCompanyDto,
      owner: user.id,
      createdBy: user.id,
      roles: [role._id],
    })

    return company
  }

  async findAll(userId: string): Promise<Company[]> {
    return this.companyModel
      .find({
        $or: [
          { owner: new Types.ObjectId(userId) },
          { users: new Types.ObjectId(userId) },
        ],
      })
      .populate([
        {
          path: 'owner',
          select: 'name',
        },
      ])
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id)

    if (!company) throw new BadRequestException('Company not found')

    return company
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: UserInterface,
  ): Promise<Company> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(id, {
      ...updateCompanyDto,
      updatedBy: user.id,
    })

    if (!updatedCompany) throw new BadRequestException('Company not found')

    return updatedCompany
  }

  async remove(id: string): Promise<Company> {
    const company = await this.findOne(id)

    const deletedCompany = await company.deleteOne()

    return deletedCompany
  }

  async addUserToCompany(companyId: unknown, userId: unknown) {
    const company = await this.companyModel.findByIdAndUpdate(companyId, {
      $push: { users: userId },
    })

    return company
  }
}
