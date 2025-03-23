import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

import { FormsTaskService } from '@/forms-task/forms-task.service'
import { FormsTaskController } from '@/forms-task/forms-task.controller'

import { FormTask, FormTaskSchema } from '@/models/form-task.model'
import { Project, ProjectSchema } from '@/models/project.model'

@Module({
  controllers: [FormsTaskController],
  providers: [FormsTaskService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: FormTask.name, schema: FormTaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  exports: [FormsTaskService],
})
export class FormsTaskModule {}
