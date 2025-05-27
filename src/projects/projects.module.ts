import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { Project, ProjectSchema } from '@/models/project.model'
import { User, UserSchema } from '@/models/user.model'
import { UserCompany, UserCompanySchema } from '@/models/user-company.model'

import { FormsTaskModule } from '@/forms-task/forms-task.module'
import { ColumnsModule } from '@/columns-task/columns.module'
import { UserModule } from '@/user/user.module'
import { NotificationsModule } from '@/notifications/notifications.module'

import { ProjectsService } from '@/projects/projects.service'
import { ProjectsController } from '@/projects/projects.controller'

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
    FormsTaskModule,
    NotificationsModule,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
