import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema } from '@/models/user.model'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { CompanyModule } from '@/company/company.module'
import { UserCompanySchema } from '@/models/user-company.model'
import { UserCompany } from '@/models/user-company.model'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
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
  ],
  exports: [UserService],
})
export class UserModule {}
