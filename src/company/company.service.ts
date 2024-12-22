import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from '../models/company.model'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { UserAuth } from 'types'
import { Role } from '@/models/role.model'
import { Permission } from '@/models/permission.model'
import { UserCompany } from '@/models/user-company.model'

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<Company>,
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
    @InjectModel(UserCompany.name)
    private userCompanyModel: Model<UserCompany>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: UserAuth): Promise<Company> {
    const permissions = await this.permissionModel.find()

    const role = await this.roleModel.create({
      name: 'Admin',
      description: 'Admin role for new company',
      permissions: permissions.map((permission) => permission._id),
      createdBy: user._id,
    })

    const company = await this.companyModel.create({
      ...createCompanyDto,
      owner: user._id,
      createdBy: user._id,
      roles: [role._id],
    })

    const userCompany = await this.userCompanyModel.create({
      user: user._id,
      company: company._id,
      roleType: 'admin',
      roles: [role._id],
      createdBy: user._id,
    })

    await company.updateOne({ usersCompany: [userCompany._id] })

    return company
  }

  async findAll(userId: string) {
    const companies = await this.companyModel
      .find({
        $or: [
          { owner: new Types.ObjectId(userId) },
          { usersCompany: { $elemMatch: { user: new Types.ObjectId(userId) } } },
        ],
      })
      .populate([
        {
          path: 'owner',
          select: 'name',
        },
        {
          path: 'usersCompany',
          select: 'user',
          model: 'UserCompany',
        },
      ])

    const companiesWithUsers = companies.map((company) => {
      const { usersCompany, ...companyWithoutUsers } = company.toObject()
      const users = usersCompany.map((userCompany) => userCompany.user)
      return { ...companyWithoutUsers, users }
    })

    return companiesWithUsers
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id)

    if (!company) throw new BadRequestException('Company not found')

    return company
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: UserAuth,
  ): Promise<Company> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(id, {
      ...updateCompanyDto,
      updatedBy: user._id,
    })

    if (!updatedCompany) throw new BadRequestException('Company not found')

    return updatedCompany
  }

  async remove(id: string): Promise<Company> {
    const company = await this.findOne(id)

    const deletedCompany = await company.deleteOne()

    return deletedCompany
  }

  async addUserToCompany(userCompany: UserCompany) {
    const company = await this.companyModel.findByIdAndUpdate(userCompany.company, {
      $push: { usersCompany: userCompany._id },
    })

    return company
  }

  async removeUserFromCompany(userCompany: UserCompany) {
    const company = await this.companyModel.findByIdAndUpdate(userCompany.company, {
      $pull: { usersCompany: userCompany._id },
    })

    return company
  }
}
