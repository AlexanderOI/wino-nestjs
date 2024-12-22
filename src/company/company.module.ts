import { Module } from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'
import { CompanySchema } from '../models/company.model'
import { Company } from '../models/company.model'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Permission } from '@/models/permission.model'
import { Role } from '@/models/role.model'
import { RoleSchema } from '@/models/role.model'
import { PermissionSchema } from '@/models/permission.model'
import { UserCompanySchema } from '@/models/user-company.model'
import { UserCompany } from '@/models/user-company.model'

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: UserCompany.name, schema: UserCompanySchema },
    ]),
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
