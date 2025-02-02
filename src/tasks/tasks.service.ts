import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Task } from '@/models/task.model'
import { Model, Types } from 'mongoose'
import { toObjectId } from '@/common/transformer.mongo-id'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { ProjectsService } from '@/projects/projects.service'
import { UserAuth } from 'types'
import { UserService } from '@/user/user.service'
import { Activity, ActivityDocument } from '@/models/activity.model'
import { ColumnsService } from '@/columns-task/columns.service'
import { format } from 'date-fns'

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    private projectsService: ProjectsService,
    private userService: UserService,
    private columnsService: ColumnsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userAuth: UserAuth) {
    const task = await this.taskModel.create(createTaskDto)
    if (!task) throw new NotFoundException('Task not created')

    await this.registerActivity(task, 'created', userAuth)

    return task
  }

  async findAll(projectId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    const tasks = await this.taskModel
      .find({ projectId })
      .populate([{ path: 'column' }, { path: 'assignedTo' }])
      .limit(limit)
      .skip(offset)

    if (!tasks) throw new NotFoundException('Tasks not found')

    return tasks
  }

  async findOne(id: string, userAuth: UserAuth): Promise<Partial<Task>> {
    const task = await this.taskModel
      .findById(id)
      .populate([{ path: 'column', select: '-__v' }])
      .select('-__v')
      .lean()

    if (!task) throw new NotFoundException('Task not found')

    const taskResponse = {
      ...task,
      project: await this.projectsService.findOne(task.projectId, userAuth, true),
      assignedTo: task.assignedToId
        ? await this.userService.findOne(task.assignedToId, userAuth, true)
        : null,
    }

    return taskResponse
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userAuth: UserAuth) {
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { ...updateTaskDto },
      { new: true },
    )

    if (!task) throw new NotFoundException('Task not updated')

    await this.createActivityUpdate(task, updateTaskDto, userAuth)

    return task
  }

  async remove(id: string, userAuth: UserAuth) {
    const task = await this.taskModel.findByIdAndDelete(id)

    if (!task) throw new NotFoundException('Task not deleted')

    await this.registerActivity(task, 'deleted', userAuth)

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

  async getTaskActivity(taskId: string) {
    return this.activityModel
      .find({ taskId: toObjectId(taskId) })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'user', select: 'name email avatar' },
        { path: 'company', select: 'name' },
        { path: 'task', select: 'name' },
      ])
      .select('-__v')
      .lean()
  }

  async getTaskActivityByProject(projectId: string) {
    let activities = await this.activityModel
      .find({ projectId: toObjectId(projectId) })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'user', select: 'name email avatar' },
        { path: 'company', select: 'name' },
        {
          path: 'task',
          select: '-__v',
          populate: { path: 'column', select: '-__v' },
        },
      ])

      .select('-__v')
      .lean()

    return activities
  }

  async registerActivity(
    task: Task,
    key: string,
    userAuth: UserAuth,
    previousValue?: string,
    newValue?: string,
  ) {
    const taskKeys = {
      name: '{userName} updated the name to {newValue}',
      description: '{userName} updated the description to {newValue}',
      columnId: '{userName} moved the task to {newValue}',
      startDate: '{userName} updated the start date to {newValue}',
      endDate: '{userName} updated the end date to {newValue}',
      assignedToId: '{userName} assigned the task to {newValue}',
      deleted: '{userName} deleted the task',
      created: '{userName} created the task',
    }

    let text = taskKeys[key]
      .replace('{userName}', userAuth.name)
      .replace('{newValue}', newValue)

    await this.activityModel.create({
      taskId: task._id,
      type: key,
      text: text,
      previousValue,
      newValue,
      userId: userAuth._id,
      projectId: task.projectId,
      companyId: userAuth.companyId,
    })

    return text
  }

  async createActivityUpdate(
    task: Task,
    updateTaskDto: UpdateTaskDto,
    userAuth: UserAuth,
  ) {
    const valueResolvers: Record<string, (id: any) => Promise<any>> = {
      projectId: async (id) => (await this.projectsService.findOne(id, userAuth))?.name,
      columnId: async (id) => (await this.columnsService.findOne(id))?.name,
      assignedToId: async (id) => (await this.userService.findOne(id, userAuth))?.name,
      startDate: async (date) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
      endDate: async (date) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
    }

    await Promise.all(
      Object.entries(updateTaskDto).map(async ([key, value]) => {
        if (value) {
          const newValue = valueResolvers[key] ? await valueResolvers[key](value) : value
          await this.registerActivity(task, key, userAuth, task[key], newValue)
        }
      }),
    )
  }
}
