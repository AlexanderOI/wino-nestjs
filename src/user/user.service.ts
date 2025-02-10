import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@/models/user.model'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserAuth } from 'types'
import { CompanyService } from '@/company/company.service'
import { hash } from 'bcrypt'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'
import { toObjectId } from '@/common/transformer.mongo-id'
import { UserResponse } from './interfaces/user-response'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(UserCompany.name)
    private userCompanyModel: Model<UserCompanyDocument>,
    private companyService: CompanyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto, user: UserAuth) {
    const { password, confirmPassword, roles, roleType, ...userData } = createUserDto

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const newUser = await this.userModel.create({
      ...userData,
      currentCompanyId: user.companyId,
      password: await hash(password, 10),
    })

    const userCompany = await this.userCompanyModel.create({
      userId: newUser._id,
      companyId: user.companyId,
      rolesId: toObjectId(roles),
      roleType,
    })

    await this.companyService.addUserToCompany(userCompany)

    return newUser
  }

  async findAll(
    user: UserAuth,
    usersIds?: Types.ObjectId[],
    withRoles = true,
  ): Promise<UserResponse[]> {
    let populate = [{ path: 'user' }]

    if (withRoles) {
      populate.push({ path: 'roles' })
    }

    const userCompany = await this.userCompanyModel
      .find({
        companyId: user.companyId,
        ...(usersIds ? { userId: { $in: usersIds } } : {}),
      })
      .populate(populate)
      .lean()

    const users = userCompany.map((userCompany) => {
      return this.createUserResponse(userCompany)
    })

    return users
  }

  async findOne(
    id: string | Types.ObjectId,
    userAuth: UserAuth,
    withRoles = true,
  ): Promise<UserResponse> {
    let populate = [{ path: 'user' }]

    if (withRoles) {
      populate.push({ path: 'roles' })
    }

    const userCompany = await this.userCompanyModel
      .findOne({
        userId: id,
        companyId: userAuth.companyId,
      })
      .populate(populate)
      .lean()

    if (!userCompany) throw new NotFoundException('User not found')

    const userResponse = this.createUserResponse(userCompany)

    return userResponse
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
      { userId: id, companyId: userAuth.companyId },
      { $set: { rolesId: toObjectId(roles) } },
    )

    return 'User updated'
  }

  async remove(id: string, userAuth: UserAuth) {
    const user = await this.userModel.findById(id)

    if (!user) throw new BadRequestException('User not found')

    await this.userCompanyModel.findOneAndDelete({
      userId: id,
      companyId: userAuth.companyId,
    })

    const userCompany = await this.userCompanyModel.find({ userId: id })

    if (userCompany.length === 0) {
      await this.userModel.findByIdAndDelete(id)

      return 'User deleted'
    }

    await this.userModel.findByIdAndUpdate(id, {
      $set: { currentCompanyId: userCompany[0].companyId },
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

  async uploadAvatar(
    file: Express.Multer.File,
    user: UserAuth,
  ): Promise<{ url: string }> {
    const avatarUrl = await this.cloudinaryService.uploadAvatar(file)

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { avatar: avatarUrl },
    })

    return { url: avatarUrl }
  }

  createUserResponse(userCompany: UserCompanyDocument): UserResponse {
    const { user, roles, roleType, isActive, companyId } = userCompany
    const { _id, name, userName, email, avatar } = user

    return {
      _id: _id.toString(),
      name,
      userName,
      email,
      avatar,
      roles: roles?.map((role) => role.name),
      rolesId: roles?.map((role) => role._id.toString()),
      roleType,
      isActive,
      company: companyId.toString(),
    }
  }
}
