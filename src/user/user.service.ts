import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { hash } from 'bcrypt'

import { File } from '@nest-lab/fastify-multer'
import { UserAuth } from '@/types'

import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'
import { User } from '@/models/user.model'
import { CompanyService } from '@/company/company.service'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { NotificationsService } from '@/notifications/notifications.service'

import { UserResponse } from '@/user/interfaces/user-response'

import { CreateUserDto } from '@/user/dto/create-user.dto'
import { UpdateUserDto } from '@/user/dto/update-user.dto'
import { UpdateInvitedUserDto } from '@/user/dto/update-invited-user.dto'
import { CreateInvitedUserDto } from '@/user/dto/create-invited-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(UserCompany.name)
    private userCompanyModel: Model<UserCompanyDocument>,
    private companyService: CompanyService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto, user: UserAuth) {
    const { password, confirmPassword, rolesId, roleType, ...userData } = createUserDto

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const userExists = await this.userModel.findOne({
      $or: [{ email: userData.email }, { userName: userData.userName }],
    })

    if (userExists) throw new BadRequestException('Username or email already in use')

    const newUser = await this.userModel.create({
      ...userData,
      currentCompanyId: user.companyId,
      password: await hash(password, 10),
    })

    const userCompany = await this.userCompanyModel.create({
      userId: newUser._id,
      companyId: user.companyId,
      rolesId,
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
    const { password, confirmPassword, ...userData } = updateUserDto

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
      { $set: updateUserDto },
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
    const company = await this.companyService.findOne(companyId, user)

    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, {
      $set: { currentCompanyId: company._id },
    })

    if (!updatedUser) throw new BadRequestException('User not found')

    return 'Successfully changed company'
  }

  async uploadAvatar(file: File, user: UserAuth): Promise<{ url: string }> {
    const avatarUrl = await this.cloudinaryService.uploadAvatar(file)

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { avatar: avatarUrl },
    })

    return { url: avatarUrl }
  }

  async findInvitedUser(userName: string, userAuth: UserAuth) {
    const invitedUser = await this.userModel
      .findOne({
        userName,
      })
      .lean()

    if (!invitedUser) throw new NotFoundException('User not found')

    const userCompany = await this.userCompanyModel.findOne({
      userId: invitedUser._id,
      companyId: userAuth.companyId,
    })

    if (userCompany) throw new BadRequestException('User already exists in your company')

    const { password, ...userData } = invitedUser

    return userData
  }

  async createInvitedUser(
    userId: string,
    createInvitedUserDto: CreateInvitedUserDto,
    userAuth: UserAuth,
  ) {
    const { rolesId, roleType } = createInvitedUserDto

    const user = await this.userModel.findById(userId)

    if (!user) throw new NotFoundException('User not found')

    const newUser = await this.userCompanyModel.create({
      userId,
      companyId: userAuth.companyId,
      rolesId,
      roleType,
      isActive: false,
      isInvited: true,
      invitePending: true,
    })

    await this.companyService.addUserToCompany(newUser)

    await this.notificationsService.sendNotification({
      userIds: [userId],
      title: 'Invitation to join company',
      description: `You have been invited to join ${userAuth.companyName}`,
      link: `/company`,
    })

    return newUser
  }

  async updateInvitedUser(
    userId: string,
    updateInvitedUserDto: UpdateInvitedUserDto,
    userAuth: UserAuth,
  ) {
    const updatedUser = await this.userCompanyModel.findOneAndUpdate(
      { userId, companyId: userAuth.companyId },
      { $set: updateInvitedUserDto },
    )

    if (!updatedUser) throw new BadRequestException('User not found')

    return updatedUser
  }

  async acceptInvitedUser(companyId: string, userAuth: UserAuth) {
    const updatedUser = await this.userCompanyModel.findOneAndUpdate(
      { userId: userAuth._id, companyId },
      { $set: { isActive: true, invitePending: false } },
    )

    if (!updatedUser) throw new BadRequestException('Invited user not found')

    const company = await this.companyService.findOne(companyId, userAuth)

    await this.notificationsService.sendNotification({
      userIds: [company.owner._id.toString()],
      title: 'Invitation to join company',
      description: `The user ${userAuth.userName} has accepted the invitation to join ${company.name}`,
      link: `/users`,
    })

    return updatedUser
  }

  async deleteInvitedUser(userId: string, userAuth: UserAuth) {
    const updatedUser = await this.userCompanyModel.findOneAndDelete({
      userId,
      companyId: userAuth.companyId,
    })

    if (!updatedUser) throw new BadRequestException('Invited user not found')

    const company = await this.companyService.findOne(userAuth.companyId, userAuth)

    await this.notificationsService.sendNotification({
      userIds: [userId],
      title: 'Invitation to join company',
      description: `The user ${userAuth.userName} has canceled the invitation to join ${company.name}`,
      link: `/users`,
    })

    return updatedUser
  }

  async leaveCompany(companyId: string, userAuth: UserAuth) {
    const updatedUser = await this.userCompanyModel.findOneAndDelete({
      userId: userAuth._id,
      companyId,
      isActive: true,
      isInvited: true,
      invitePending: false,
    })

    if (!updatedUser) throw new BadRequestException('User not found')

    const company = await this.companyService.findOne(companyId, userAuth)

    await this.notificationsService.sendNotification({
      userIds: [company.owner._id.toString()],
      title: 'Leave company',
      description: `The user ${userAuth.userName} has left the company ${company.name}`,
      link: `/users`,
    })

    return updatedUser
  }

  async rejectInvitedUser(companyId: string, userAuth: UserAuth) {
    const updatedUser = await this.userCompanyModel.findOneAndDelete({
      userId: userAuth._id,
      companyId,
      isInvited: true,
      invitePending: true,
    })

    if (!updatedUser) throw new BadRequestException('Invited user not found')

    const company = await this.companyService.findOne(companyId, userAuth)

    await this.notificationsService.sendNotification({
      userIds: [company.owner._id.toString()],
      title: 'Invitation to join company',
      description: `The user ${userAuth.userName} has rejected the invitation to join ${company.name}`,
      link: `/users`,
    })

    return updatedUser
  }

  createUserResponse(userCompany: UserCompanyDocument): UserResponse {
    const {
      user,
      roles,
      roleType,
      isInvited,
      isActive,
      companyId,
      createdAt,
      updatedAt,
      invitePending,
    } = userCompany
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
      isInvited,
      invitePending,
      company: companyId.toString(),
      createdAt,
      updatedAt,
    }
  }
}
