import { Module } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { ProjectSchema } from '@/models/project.model'
import { MongooseModule } from '@nestjs/mongoose'
import { Project } from '@/models/project.model'
import { User } from '@/models/user.model'
import { UserSchema } from '@/models/user.model'
import { JwtService } from '@nestjs/jwt'
import { ColumnsModule } from '@/columns-task/columns.module'
import { UserModule } from '@/user/user.module'
import { UserCompany, UserCompanySchema } from '@/models/user-company.model'
@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: UserCompany.name, schema: UserCompanySchema },
    ]),
    ColumnsModule,
    UserModule,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
