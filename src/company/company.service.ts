import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company, CompanyDocument } from '../models/company.model'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { UserAuth } from 'types'
import { Role } from '@/models/role.model'
import { Permission } from '@/models/permission.model'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
    @InjectModel(UserCompany.name)
    private userCompanyModel: Model<UserCompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: UserAuth): Promise<Company> {
    const permissions = await this.permissionModel.find()

    const role = await this.roleModel.create({
      name: 'Admin',
      description: 'Admin role for new company',
      permissions: permissions.map((permission) => permission._id),
    })

    const company = await this.companyModel.create({
      ...createCompanyDto,
      owner: user._id,
      roles: [role._id],
    })

    const userCompany = await this.userCompanyModel.create({
      userId: user._id,
      companyId: company._id,
      roleType: 'admin',
      rolesId: [role._id],
    })

    await company.updateOne({ usersCompany: [userCompany._id] })

    return company
  }

  async findAll(userId: string) {
    const userCompany = await this.userCompanyModel.find({ userId }).select('companyId')
    const companies = await this.companyModel
      .find({
        $or: [
          { owner: userId },
          { _id: { $in: userCompany.map((user) => user.companyId) } },
        ],
      })
      .populate([{ path: 'owner', select: 'name avatar' }, ,])
      .select('-updatedAt -createdAt -__v')
      .lean()
    console.log(companies, companies.length)

    return companies
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel
      .findById(id)
      .populate([{ path: 'owner', select: 'name avatar' }])
      .select('-updatedAt -createdAt -__v')
      .lean()

    if (!company) throw new BadRequestException('Company not found')

    return company
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: UserAuth,
  ): Promise<Company> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateCompanyDto)

    if (!updatedCompany) throw new BadRequestException('Company not found')

    return updatedCompany
  }

  async remove(id: string): Promise<Company> {
    const company = await this.findOne(id)

    const deletedCompany = await company.deleteOne()

    return deletedCompany
  }

  async addUserToCompany(userCompany: UserCompany) {
    const company = await this.companyModel.findByIdAndUpdate(userCompany.companyId, {
      $push: { usersCompany: userCompany._id },
    })

    return company
  }

  async removeUserFromCompany(userCompany: UserCompany) {
    const company = await this.companyModel.findByIdAndUpdate(userCompany.companyId, {
      $pull: { usersCompany: userCompany._id },
    })

    return company
  }
}
