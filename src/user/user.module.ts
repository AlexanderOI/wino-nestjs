import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema } from '@/models/user.model'
import { UserCompanyRole } from '@/models/user-company-role.model'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { CompanyService } from '@/company/company.service'
import { CompanyModule } from '@/company/company.module'

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CompanyModule,
  ],
})
export class UserModule {}
