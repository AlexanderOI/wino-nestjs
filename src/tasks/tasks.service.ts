import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Task } from '@/models/task.model'
import { Model } from 'mongoose'
import { toObjectId } from '@/common/transformer.mongo-id'

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const { projectId, columnId, ...taskData } = createTaskDto

    const task = await this.taskModel.create({
      ...taskData,
      projectId: toObjectId(projectId),
      columnId: toObjectId(columnId),
    })

    if (!task) throw new NotFoundException('Task not created')

    return task
  }

  async findAll(projectId: string) {
    const tasks = await this.taskModel.find({ projectId })

    if (!tasks) throw new NotFoundException('Tasks not found')

    return tasks
  }

  async findOne(id: string) {
    const task = await this.taskModel.findById(id)

    if (!task) throw new NotFoundException('Task not found')

    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const { columnId, ...taskData } = updateTaskDto
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      {
        ...taskData,
        columnId: toObjectId(columnId),
      },
      {
        new: true,
      },
    )

    if (!task) throw new NotFoundException('Task not updated')

    return task
  }

  async remove(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id)

    if (!task) throw new NotFoundException('Task not deleted')

    return task
  }

  async reorder(taskOrders: { id: string; order: number }[]) {
    await Promise.all(
      taskOrders.map(({ id, order }) =>
        this.taskModel.findByIdAndUpdate(toObjectId(id), { order }),
      ),
    )

    return 'Tasks reordered'
  }
}
