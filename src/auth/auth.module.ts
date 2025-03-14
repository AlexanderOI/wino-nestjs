import { JwtService } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/auth.service'
import { User, UserSchema } from '@/models/user.model'
import { Company, CompanySchema } from '@/models/company.model'
import { Role, RoleSchema } from '@/models/role.model'
import { Permission, PermissionSchema } from '@/models/permission.model'
import { UserCompany, UserCompanySchema } from '@/models/user-company.model'
import { DataModule } from '@/data/data.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: UserCompany.name, schema: UserCompanySchema },
    ]),
    DataModule,
  ],
  exports: [JwtService],
})
export class AuthModule {}
