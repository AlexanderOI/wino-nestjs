import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from '@/models/role.model'
import { JwtService } from '@nestjs/jwt'
import { Company, CompanySchema } from '@/models/company.model'

@Module({
  controllers: [RolesController],
  providers: [RolesService, JwtService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
  ],
})
export class RolesModule {}
