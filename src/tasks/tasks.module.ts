import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { Task } from '@/models/task.model'
import { JwtService } from '@nestjs/jwt'
import { TaskSchema } from '@/models/task.model'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  controllers: [TasksController],
  providers: [TasksService, JwtService],
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
})
export class TasksModule {}
