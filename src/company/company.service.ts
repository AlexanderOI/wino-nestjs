import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserAuth } from '@/types'

import { CreateCompanyDto, UpdateCompanyDto } from '@/company/dto'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'
import { Company, CompanyDocument } from '@/models/company.model'
import { Permission } from '@/models/permission.model'
import { Role } from '@/models/role.model'

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
    await this.checkExistCompany(createCompanyDto.name)

    const permissions = await this.permissionModel.find()

    const role = await this.roleModel.create({
      name: 'Admin',
      description: 'Admin role for new company',
      permissions: permissions.map((permission) => permission._id),
    })

    const company = await this.companyModel.create({
      ...createCompanyDto,
      owner: user._id,
      rolesId: [role._id],
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

  async findAll(user: UserAuth): Promise<Company[]> {
    const userCompany = await this.userCompanyModel
      .find({ userId: user._id })
      .select('companyId isActive roleType isInvited invitePending')

    const companies = await this.companyModel
      .find({
        $or: [
          { owner: user._id },
          { _id: { $in: userCompany.map((user) => user.companyId) } },
        ],
      })
      .populate([{ path: 'owner', select: 'name avatar avatarColor' }])
      .select('-updatedAt -__v')
      .lean()

    return companies.map((company) => {
      const user = userCompany.find(
        (user) => user.companyId.toString() === company._id.toString(),
      )

      return {
        ...company,
        isActive: user?.isActive,
        roleType: user?.roleType,
        isInvited: user?.isInvited,
        invitePending: user?.invitePending,
      }
    })
  }

  async findOne(id: unknown, user: UserAuth): Promise<Company> {
    const company = await this.companyModel
      .findById(id)
      .populate([
        { path: 'owner', select: 'name avatar avatarColor' },
        { path: 'usersCompany', match: { userId: user._id } },
      ])
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
    const company = await this.companyModel.findById(id)

    await this.checkExistCompany(updateCompanyDto.name, id)

    if (!company) throw new BadRequestException('Company not found')

    this.checkCompanyOwner(company, user)

    const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateCompanyDto)

    return updatedCompany
  }

  async remove(id: string, user: UserAuth) {
    const company = await this.companyModel.findById(id)

    if (!company) throw new BadRequestException('Company not found')

    this.checkCompanyOwner(company, user)

    await company.deleteOne()

    return 'Company deleted successfully'
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

  checkCompanyOwner(company: Company, user: UserAuth) {
    if (company.owner.toString() !== user._id.toString()) {
      throw new BadRequestException('You are not the owner of this company')
    }
  }

  async checkExistCompany(name: string, id?: string) {
    const company = await this.companyModel.findOne({ name, _id: { $ne: id } })

    if (company) {
      throw new ConflictException(`Company with name ${name} already exists`)
    }
  }
}
