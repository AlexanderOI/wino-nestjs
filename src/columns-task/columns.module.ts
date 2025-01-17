import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ColumnsController } from './columns.controller'
import { ColumnsService } from './columns.service'
import { ColumnTask, ColumnTaskSchema } from '@/models/column-task.model'
import { Task, TaskSchema } from '@/models/task.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ColumnTask.name, schema: ColumnTaskSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
