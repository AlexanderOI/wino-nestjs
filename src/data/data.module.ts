import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DataService } from './data.service'
import { DataController } from './data.controller'
import { User, UserSchema } from '@/models/user.model'
import { Role, RoleSchema } from '@/models/role.model'
import { Permission, PermissionSchema } from '@/models/permission.model'
import { Company, CompanySchema } from '@/models/company.model'
import { UserCompany, UserCompanySchema } from '@/models/user-company.model'
import { ColumnTask, ColumnTaskSchema } from '@/models/column-task.model'
import { Task, TaskSchema } from '@/models/task.model'
import { Project, ProjectSchema } from '@/models/project.model'
import { Activity, ActivitySchema } from '@/models/activity.model'
import { ColumnsModule } from '@/columns-task/columns.module'
@Module({
  controllers: [DataController],
  providers: [DataService],

  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Company.name, schema: CompanySchema },
      { name: UserCompany.name, schema: UserCompanySchema },
      { name: ColumnTask.name, schema: ColumnTaskSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    ColumnsModule,
  ],
})
export class DataModule {}
