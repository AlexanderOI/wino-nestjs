import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { Task, TaskSchema } from '@/models/task.model'
import { JwtService } from '@nestjs/jwt'
import { Activity, ActivitySchema } from '@/models/activity.model'
import { MongooseModule } from '@nestjs/mongoose'
import { ProjectsModule } from '@/projects/projects.module'
import { UserModule } from '@/user/user.module'
import { ColumnsModule } from '@/columns-task/columns.module'
@Module({
  controllers: [TasksController],
  providers: [TasksService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    ProjectsModule,
    UserModule,
    ColumnsModule,
  ],
})
export class TasksModule {}
