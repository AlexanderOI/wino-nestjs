import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@/models/user.model'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserInterface } from 'types'
import { CompanyService } from '@/company/company.service'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private companyService: CompanyService,
  ) {}

  async create(createUserDto: CreateUserDto, user: UserInterface) {
    const newUser = await this.userModel.create(createUserDto)

    await this.companyService.addUserToCompany(user.companyId, newUser._id)

    return newUser
  }

  async findAll(user: UserInterface) {
    const company = await this.companyService.findOne(user.companyId)

    return await this.userModel.find({ _id: { $in: company.users } })
  }

  async findOne(id: string) {
    return await this.userModel.findById(id)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto)
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id)
  }

  async changeCurrentCompany(companyId: string, user: UserInterface) {
    const company = await this.companyService.findOne(companyId)

    const updatedUser = await this.userModel.findByIdAndUpdate(user.id, {
      $set: { currentCompanyId: company._id },
    })

    if (!updatedUser) throw new BadRequestException('User not found')

    return true
  }
}
