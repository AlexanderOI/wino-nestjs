import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@/models/user.model'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserAuth } from 'types'
import { CompanyService } from '@/company/company.service'
import { hash } from 'bcrypt'
import { Role } from '@/models/role.model'
import { UserCompany } from '@/models/user-company.model'
import { toObjectId } from '@/common/transformer.mongo-id'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(UserCompany.name)
    private userCompanyModel: Model<UserCompany>,
    private companyService: CompanyService,
  ) {}

  async create(createUserDto: CreateUserDto, user: UserAuth) {
    const { password, confirmPassword, roles, ...userData } = createUserDto

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const newUser = await this.userModel.create({
      ...userData,
      password: await hash(password, 10),
    })

    const userCompany = await this.userCompanyModel.create({
      user: newUser._id,
      company: user.companyId,
      roles: toObjectId(roles),
    })

    await this.companyService.addUserToCompany(userCompany)

    return newUser
  }

  async findAll(user: UserAuth) {
    const userCompany = await this.userCompanyModel.find({
      company: user.companyId,
    })

    const users = await this.userModel.find({
      _id: { $in: userCompany.map((userCompany) => userCompany.user) },
    })

    return users
  }

  async findOne(id: string, userAuth: UserAuth) {
    const user = await this.userModel.findById(id).exec()

    if (!user) throw new BadRequestException('User not found')

    const userCompany = await this.userCompanyModel
      .findOne({
        user: user._id,
        company: userAuth.companyId,
      })
      .exec()

    const { password, ...userWithoutPassword } = user.toObject()

    const userWithRoles = {
      ...userWithoutPassword,
      roles: userCompany?.roles,
      roleType: userCompany?.roleType,
    }

    return userWithRoles
  }

  async update(id: string, updateUserDto: UpdateUserDto, userAuth: UserAuth) {
    const { password, confirmPassword, roles, ...userData } = updateUserDto

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match')
      }

      userData['password'] = await hash(password, 10)
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, {
      $set: { ...userData },
    })

    if (!updatedUser) throw new BadRequestException('User not found')

    await this.userCompanyModel.findOneAndUpdate(
      { user: id, company: userAuth.companyId },
      { $set: { roles: toObjectId(roles) } },
    )

    return 'User updated'
  }

  async remove(id: string, userAuth: UserAuth) {
    const user = await this.userModel.findById(id)

    if (!user) throw new BadRequestException('User not found')

    await this.userCompanyModel.findOneAndDelete({
      user: id,
      company: userAuth.companyId,
    })

    const userCompany = await this.userCompanyModel.find({ user: id })

    if (userCompany.length === 0) {
      await this.userModel.findByIdAndDelete(id)

      return 'User deleted'
    }

    await this.userModel.findByIdAndUpdate(id, {
      $set: { currentCompanyId: userCompany[0].company },
    })

    return 'User connected to another company'
  }

  async changeCurrentCompany(companyId: string, user: UserAuth) {
    const company = await this.companyService.findOne(companyId)

    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, {
      $set: { currentCompanyId: company._id },
    })

    if (!updatedUser) throw new BadRequestException('User not found')

    return 'Successfully changed company'
  }
}
