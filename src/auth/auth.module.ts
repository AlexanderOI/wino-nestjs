import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/models/user.model'
import { Company, CompanySchema } from '@/models/company.model'
import { Role, RoleSchema } from '@/models/role.model'
import { JwtService } from '@nestjs/jwt'
import { Permission, PermissionSchema } from '@/models/permission.model'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],
})
export class AuthModule {}
