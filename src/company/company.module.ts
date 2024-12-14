import { Module } from '@nestjs/common'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'
import { CompanySchema } from './entities/company.entity'
import { Company } from './entities/company.entity'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Permission } from 'src/permissions/entities/permission.entity'
import { Role } from 'src/roles/entities/role.entity'
import { RoleSchema } from 'src/roles/entities/role.entity'
import { PermissionSchema } from 'src/permissions/entities/permission.entity'

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
