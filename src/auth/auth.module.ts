import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './entities/user.entity'
import { Company, CompanySchema } from 'src/company/entities/company.entity'
import { Role, RoleSchema } from 'src/roles/entities/role.entity'
import { JwtService } from '@nestjs/jwt'
import { Permission, PermissionSchema } from 'src/permissions/entities/permission.entity'

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
