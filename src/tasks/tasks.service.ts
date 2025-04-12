import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UserAuth } from '@/types'

import { format } from 'date-fns'
import { toObjectId } from '@/common/transformer.mongo-id'

import { Task } from '@/models/task.model'
import { Activity, ActivityDocument } from '@/models/activity.model'

import { ColumnsService } from '@/columns-task/columns.service'
import { ProjectsService } from '@/projects/projects.service'
import { UserService } from '@/user/user.service'

import { PaginationDto } from '@/common/dto/pagination.dto'
import { CreateTaskDto } from '@/tasks/dto/create-task.dto'
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto'
import { FilterTaskDto } from '@/tasks/dto/filter-task.dto'
import { CreateFieldDto } from '@/tasks/dto/create-field.dto'
import { UpdateFieldDto } from '@/tasks/dto/update-field.dto'

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
    const task = await this.taskModel.create({
      ...createTaskDto,
      companyId: userAuth.companyId,
    })
    if (!task) throw new NotFoundException('Task not created')

    await this.registerActivity(task, 'created', userAuth)

    return task
  }

  async findAll(
    filterTaskDto: FilterTaskDto,
    userAuth: UserAuth,
    fields: boolean = false,
  ) {
    const {
      projectId,
      columnId,
      assignedToId,
      status,
      search,
      fromUpdatedAt,
      toUpdatedAt,
      offset = 0,
      limit = 10,
    } = filterTaskDto
    const filters = {}

    if (projectId) filters['projectId'] = projectId
    if (columnId) filters['columnId'] = columnId
    if (assignedToId) filters['assignedToId'] = assignedToId
    if (status) filters['status'] = status
    if (search) filters['name'] = { $regex: search, $options: 'i' }
    if (fromUpdatedAt && toUpdatedAt)
      filters['updatedAt'] = { $gte: fromUpdatedAt, $lte: toUpdatedAt }

    const tasks = await this.taskModel
      .find({ companyId: userAuth.companyId, ...filters })
      .populate([
        { path: 'column', select: 'name color' },
        { path: 'assignedTo', select: 'name email avatar' },
        { path: 'project', select: 'name' },
      ])
      .select('-__v')
      .skip(offset)
      .limit(limit)
      .lean()

    console.log(tasks.length)

    return tasks
  }

  async getTotalTasks(userAuth: UserAuth) {
    return this.taskModel.countDocuments({ companyId: userAuth.companyId })
  }

  async findByProject(
    projectId: string,
    userAuth: UserAuth,
    paginationDto: PaginationDto,
    fields: boolean = false,
  ) {
    const { limit = 10, offset = 0 } = paginationDto
    let select = fields ? '-__v' : '-__v -fields'

    const tasks = await this.taskModel
      .find({ companyId: userAuth.companyId, projectId })
      .select(select)
      .populate([{ path: 'column' }, { path: 'assignedTo' }])
      .limit(limit)
      .skip(offset)

    if (!tasks) throw new NotFoundException('Tasks not found')

    return tasks
  }

  async findOne(
    id: string,
    userAuth: UserAuth,
    fields: boolean = false,
  ): Promise<Partial<Task>> {
    let select = fields ? '-__v' : '-__v -fields'

    const task = await this.taskModel
      .findById(id)
      .populate([{ path: 'column', select: '-__v' }])
      .select(select)
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
      { _id: id, companyId: userAuth.companyId },
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

  async createField(id: string, createFieldDto: CreateFieldDto, userAuth: UserAuth) {
    console.log(createFieldDto)
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { $push: { fields: createFieldDto } },
      { new: true },
    )
    if (!task) throw new NotFoundException('Task not updated')

    return task
  }

  async updateField(
    id: string,
    fieldId: string,
    updateFieldDto: UpdateFieldDto,
    userAuth: UserAuth,
  ) {
    const task = await this.taskModel.updateOne(
      { _id: id, 'fields._id': fieldId },
      { $set: { 'fields.$.value': updateFieldDto.value } },
      { new: true },
    )
    if (!task) throw new NotFoundException('Task not updated')

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

  async getTaskActivity(
    userAuth: UserAuth,
    projectId?: string,
    taskId?: string,
    userId?: string,
  ) {
    let filters = {}

    if (projectId) filters['projectId'] = toObjectId(projectId)
    if (taskId) filters['taskId'] = toObjectId(taskId)
    if (userId) filters['userId'] = toObjectId(userId)

    let activities = await this.activityModel
      .find({ ...filters, companyId: userAuth.companyId })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'user', select: 'name email avatar' },
        { path: 'company', select: 'name' },
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
      // startDate: '{userName} updated the start date to {newValue}',
      // endDate: '{userName} updated the end date to {newValue}',
      assignedToId: '{userName} assigned the task to {newValue}',
      deleted: '{userName} deleted the task',
      created: '{userName} created the task',
    }

    let text = taskKeys[key]
      .replace('{userName}', userAuth.name)
      .replace('{newValue}', newValue)

    const column = await this.columnsService.findOne(task.columnId.toString())

    await this.activityModel.create({
      taskId: task._id,
      task: task,
      column: column,
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
