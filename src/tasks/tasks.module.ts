import { Module } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { Task, TaskSchema } from '@/models/task.model'
import { Activity, ActivitySchema } from '@/models/activity.model'
import { FormTask, FormTaskSchema } from '@/models/form-task.model'

import { TasksService } from '@/tasks/tasks.service'
import { TasksController } from '@/tasks/tasks.controller'

import { UserModule } from '@/user/user.module'
import { ProjectsModule } from '@/projects/projects.module'
import { ColumnsModule } from '@/columns-task/columns.module'
import { NotificationsModule } from '@/notifications/notifications.module'

@Module({
  controllers: [TasksController],
  providers: [TasksService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: FormTask.name, schema: FormTaskSchema },
    ]),
    ProjectsModule,
    UserModule,
    ColumnsModule,
    NotificationsModule,
  ],
})
export class TasksModule {}
