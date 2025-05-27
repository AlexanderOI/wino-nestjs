import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { UserService } from '@/user/user.service'
import { UserController } from '@/user/user.controller'

import { User, UserSchema } from '@/models/user.model'
import { UserCompany, UserCompanySchema } from '@/models/user-company.model'

import { CompanyModule } from '@/company/company.module'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { NotificationsModule } from '@/notifications/notifications.module'

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserCompany.name, schema: UserCompanySchema },
    ]),
    CompanyModule,
    CloudinaryModule,
    NotificationsModule,
  ],
  exports: [UserService],
})
export class UserModule {}
