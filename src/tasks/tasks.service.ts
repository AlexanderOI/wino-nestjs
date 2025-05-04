import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { UserAuth } from '@/types'

import { format } from 'date-fns'
import { toObjectId } from '@/common/transformer.mongo-id'

import { Task, TaskDocument } from '@/models/task.model'
import { Activity, ActivityDocument } from '@/models/activity.model'
import { Field, FieldType, FormTask } from '@/models/form-task.model'

import { ColumnsService } from '@/columns-task/columns.service'
import { ProjectsService } from '@/projects/projects.service'
import { UserService } from '@/user/user.service'

import { FilterTaskDto, SortDto } from '@/tasks/dto/filter-task.dto'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { CreateTaskDto } from '@/tasks/dto/create-task.dto'
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto'
import { CreateFieldDto } from '@/tasks/dto/create-field.dto'
import { UpdateFieldDto } from '@/tasks/dto/update-field.dto'

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(FormTask.name) private formTaskModel: Model<FormTask>,
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

  async findAll(filterTaskDto: FilterTaskDto, userAuth: UserAuth) {
    const { limit = 10, offset = 0 } = filterTaskDto
    const { sort = { dateOnly: 1 }, ...filters } = this.buildFilters(
      filterTaskDto,
      userAuth,
    )

    const tasks = await this.taskModel.aggregate([
      { $match: filters },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            {
              $addFields: {
                dateOnly: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$createdAt',
                  },
                },
              },
            },
            {
              $lookup: {
                from: 'columntasks',
                localField: 'columnId',
                foreignField: '_id',
                as: 'column',
                pipeline: [{ $project: { name: 1, color: 1 } }],
              },
            },
            { $unwind: { path: '$column', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'users',
                localField: 'assignedToId',
                foreignField: '_id',
                as: 'assignedTo',
                pipeline: [{ $project: { name: 1, email: 1, avatar: 1 } }],
              },
            },
            { $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'projects',
                localField: 'projectId',
                foreignField: '_id',
                as: 'project',
                pipeline: [{ $project: { name: 1 } }],
              },
            },
            { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
            { $sort: sort },
            { $skip: offset },
            { $limit: limit },
            { $project: { __v: 0 } },
          ],
        },
      },
    ])

    const total = tasks[0].metadata[0]?.total || 0
    const data = tasks[0].data

    return { tasks: data, total }
  }

  private buildFilters(dto: FilterTaskDto, user: UserAuth) {
    const {
      projectId,
      columnsId,
      assignedToId,
      search,
      fromUpdatedAt,
      toUpdatedAt,
      fromCreatedAt,
      toCreatedAt,
      sort,
    } = dto

    const filters: FilterQuery<TaskDocument> = {
      companyId: user.companyId,
    }

    if (projectId) filters.projectId = projectId
    if (columnsId?.length) filters.columnId = { $in: columnsId }
    if (assignedToId?.length) filters.assignedToId = { $in: assignedToId }

    if (search) {
      filters.$or = [{ name: { $regex: search, $options: 'i' } }]
    }

    if (fromUpdatedAt || toUpdatedAt) {
      filters.updatedAt = {}
      if (fromUpdatedAt) filters.updatedAt.$gte = fromUpdatedAt
      if (toUpdatedAt) filters.updatedAt.$lte = toUpdatedAt
    }

    if (fromCreatedAt || toCreatedAt) {
      filters.createdAt = {}
      if (fromCreatedAt) filters.createdAt.$gte = fromCreatedAt
      if (toCreatedAt) filters.createdAt.$lte = toCreatedAt
    }

    if (sort?.length) {
      filters.sort = this.buildSortObject(sort)
    }

    return filters
  }

  private buildSortObject(sort: SortDto[]) {
    return sort.reduce(
      (acc, item) => {
        let isDesc = item.desc ? -1 : 1

        switch (item.id) {
          case 'createdAt':
            acc.dateOnly = isDesc
            break
          case 'assignedTo':
            acc['assignedTo.name'] = isDesc
            break
          case 'task':
            acc['name'] = isDesc
            break
          case 'status':
            acc['column.name'] = isDesc
            break
          default:
            acc[item.id] = isDesc
            break
        }
        return acc
      },
      {} as Record<string, number>,
    )
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
    const task = await this.taskModel.findById(id)
    if (!task) throw new NotFoundException('Task not found')

    const previousField = task.fields.find(
      (f) => (f as any)._id.toString() === String(fieldId),
    )
    if (!previousField) throw new NotFoundException('Field not found')

    const formTask = await this.formTaskModel
      .findOne({
        companyId: userAuth.companyId,
        'fields._id': previousField.idField,
      })
      .select({
        fields: {
          $elemMatch: { _id: previousField.idField },
        },
      })

    if (!formTask) throw new NotFoundException('Form task not found')

    const updatedTask = await this.taskModel.updateOne(
      { _id: id, 'fields._id': fieldId },
      { $set: { 'fields.$.value': updateFieldDto.value } },
      { new: true },
    )
    if (!updatedTask) throw new NotFoundException('Task not updated')

    await this.registerActivity(
      task,
      formTask.fields[0].label,
      userAuth,
      this.formatDynamicField(previousField.value, formTask.fields[0]),
      this.formatDynamicField(updateFieldDto.value, formTask.fields[0]),
    )

    return updatedTask
  }

  async reorder(taskOrders: { id: string; order: number }[]) {
    await Promise.all(
      taskOrders.map(({ id, order }) =>
        this.taskModel.findByIdAndUpdate(toObjectId(id), { order }),
      ),
    )

    return 'Tasks reordered'
  }

  formatDynamicField(value: string, field: Field) {
    switch (field.type) {
      case FieldType.Select:
        return field.options.find((o) => (o as any)._id.toString() === value)?.value
      case FieldType.Date:
        return format(new Date(value), 'PPP')
      case FieldType.DateTime:
        return format(new Date(value), 'PPP HH:mm')
      default:
        return value
    }
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
    const defaultMessages = {
      name: '{userName} updated the name to {newValue}',
      description: '{userName} updated the description',
      columnId: '{userName} moved the task to {newValue}',
      assignedToId: '{userName} assigned the task to {newValue}',
      deleted: '{userName} deleted the task',
      created: '{userName} created the task',
    }

    if (key.startsWith('fields.')) {
      const fieldId = key.split('.')[1]
      const field = task.fields.find((f) => f.idField.toString() === fieldId)
      if (field) {
        const text = `{userName} updated ${fieldId} to {newValue}`
        return await this.createActivityRecord(
          task,
          text,
          userAuth,
          previousValue,
          newValue,
        )
      }
    }

    const message =
      defaultMessages[key] || `{userName} updated field ${key} to {newValue}`
    return await this.createActivityRecord(
      task,
      message,
      userAuth,
      previousValue,
      newValue,
    )
  }

  private async createActivityRecord(
    task: Task,
    message: string,
    userAuth: UserAuth,
    previousValue?: string,
    newValue?: string,
  ) {
    const text = message
      .replace('{userName}', userAuth.name)
      .replace('{newValue}', newValue || '')

    const column = await this.columnsService.findOne(task.columnId.toString())

    await this.activityModel.create({
      taskId: task._id,
      task: task,
      column: column,
      type: 'update',
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
