import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'

import { UserAuth } from '@/types'

import { format } from 'date-fns'
import { toObjectId } from '@/common/transformer.mongo-id'

import { Task, TaskDocument } from '@/models/task.model'
import { Activity, ActivityDocument } from '@/models/activity.model'
import { Field, FieldType, FormTask } from '@/models/form-task.model'

import { calculateOrder } from '@/common/utils/calculate-order'
import { NotificationsService } from '@/notifications/notifications.service'
import { ColumnsService } from '@/columns-task/columns.service'
import { ProjectsService } from '@/projects/projects.service'
import { UserService } from '@/user/user.service'

import { FilterTaskDto, SortDto } from '@/tasks/dto/filter-task.dto'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { CreateTaskDto } from '@/tasks/dto/create-task.dto'
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto'
import { CreateFieldDto } from '@/tasks/dto/create-field.dto'
import { UpdateFieldDto } from '@/tasks/dto/update-field.dto'
import { SelectTaskDto } from '@/tasks/dto/select.dto'
import { FilterTaskActivityDto } from '@/tasks/dto/filter-task-activity'
import { MoveToColumnDto } from '@/tasks/dto/move-to-column.dto'
import { MoveTaskPositionDto } from '@/tasks/dto/move-task-position.dto'

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(FormTask.name) private formTaskModel: Model<FormTask>,
    private notificationsService: NotificationsService,
    private projectsService: ProjectsService,
    private userService: UserService,
    private columnsService: ColumnsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userAuth: UserAuth) {
    const lastTask = await this.taskModel
      .findOne({ companyId: userAuth.companyId })
      .sort({ code: -1 })
    const code = lastTask ? lastTask.code + 1 : 1

    const lastTaskInColumn = await this.taskModel
      .findOne({ columnId: createTaskDto.columnId, companyId: userAuth.companyId })
      .sort({ order: -1 })
    const order = lastTaskInColumn ? lastTaskInColumn.order + 1000 : 1000

    const task = await this.taskModel.create({
      ...createTaskDto,
      companyId: userAuth.companyId,
      code,
      order,
    })
    if (!task) throw new NotFoundException('Task not created')

    await this.registerActivity(task, 'created', userAuth)

    return task
  }

  async createAtPosition(
    createTaskDto: CreateTaskDto,
    userAuth: UserAuth,
    insertAfterTaskId: string | null = null,
  ) {
    const lastTask = await this.taskModel
      .findOne({ companyId: userAuth.companyId })
      .sort({ code: -1 })
    const code = lastTask ? lastTask.code + 1 : 1

    const newOrder = await this.calculateNewOrder(
      createTaskDto.columnId,
      userAuth.companyId,
      insertAfterTaskId,
    )

    const task = await this.taskModel.create({
      ...createTaskDto,
      companyId: userAuth.companyId,
      code,
      order: newOrder,
    })
    if (!task) throw new NotFoundException('Task not created')

    await this.registerActivity(task, 'created', userAuth)

    return task
  }

  async moveTaskToColumn(
    taskId: string,
    moveToColumnDto: MoveToColumnDto,
    userAuth: UserAuth,
  ) {
    const { newColumnId, insertAfterTaskId } = moveToColumnDto

    const task = await this.taskModel.findById(taskId)
    if (!task) throw new NotFoundException('Task not found')

    const newOrder = await this.calculateNewOrder(
      newColumnId,
      userAuth.companyId,
      insertAfterTaskId,
    )

    const updatedTask = await this.taskModel.findByIdAndUpdate(
      taskId,
      { columnId: newColumnId, order: newOrder },
      { new: true },
    )

    if (!updatedTask) throw new NotFoundException('Task not updated')

    await this.registerActivity(updatedTask, 'columnId', userAuth)

    return updatedTask
  }

  async moveTaskToPosition(
    taskId: string,
    moveTaskPositionDto: MoveTaskPositionDto,
    userAuth: UserAuth,
  ) {
    const { insertAfterTaskId } = moveTaskPositionDto

    const task = await this.taskModel.findOne({
      _id: taskId,
      companyId: userAuth.companyId,
    })

    if (!task) throw new NotFoundException('Task not found')

    const newOrder = await this.calculateNewOrder(
      task.columnId,
      userAuth.companyId,
      insertAfterTaskId,
      taskId,
    )

    const updatedTask = await this.taskModel.findByIdAndUpdate(
      taskId,
      { columnId: task.columnId, order: newOrder },
      { new: true },
    )

    if (!updatedTask) throw new NotFoundException('Task not updated')

    await this.registerActivity(updatedTask, 'order', userAuth)

    return updatedTask
  }

  async rebalanceColumn(
    columnId: string | Types.ObjectId,
    companyId: string | Types.ObjectId,
  ) {
    const tasks = await this.taskModel
      .find({ columnId: toObjectId(columnId), companyId: toObjectId(companyId) })
      .sort({ order: 1 })

    if (tasks.length === 0) return

    const updates = tasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { order: (index + 1) * 1000 },
      },
    }))

    await this.taskModel.bulkWrite(updates)
  }

  private async calculateNewOrder(
    columnId: string | Types.ObjectId,
    companyId: string | Types.ObjectId,
    insertAfterTaskId: string | Types.ObjectId | null,
    excludeTaskId?: string,
  ): Promise<number> {
    let newOrder: number

    if (!insertAfterTaskId) {
      const query: any = {
        columnId: toObjectId(columnId),
        companyId: toObjectId(companyId),
      }
      if (excludeTaskId) {
        query._id = { $ne: toObjectId(excludeTaskId) }
      }

      const firstTask = await this.taskModel.findOne(query).sort({ order: 1 })

      newOrder = await this.calculateOrderWithRebalance(
        null,
        firstTask?.order || null,
        columnId,
        companyId,
      )
    } else {
      const currentTask = await this.taskModel.findById(insertAfterTaskId)
      if (!currentTask) throw new NotFoundException('Reference task not found')

      const nextTaskQuery: any = {
        columnId: toObjectId(columnId),
        companyId: toObjectId(companyId),
        order: { $gt: currentTask.order },
      }
      if (excludeTaskId) {
        nextTaskQuery._id = { $ne: toObjectId(excludeTaskId) }
      }

      const nextTask = await this.taskModel.findOne(nextTaskQuery).sort({ order: 1 })

      newOrder = await this.calculateOrderWithRebalance(
        currentTask.order,
        nextTask?.order || null,
        columnId,
        companyId,
      )
    }

    return newOrder
  }

  private async calculateOrderWithRebalance(
    previousOrder: number | null,
    nextOrder: number | null,
    columnId: string | Types.ObjectId,
    companyId: string | Types.ObjectId,
  ): Promise<number> {
    const calculatedOrder = calculateOrder(previousOrder, nextOrder)

    if (calculatedOrder === 'REBALANCE_NEEDED') {
      await this.rebalanceColumn(columnId, companyId)

      if (!previousOrder) {
        const firstTask = await this.taskModel
          .findOne({ columnId: toObjectId(columnId), companyId: toObjectId(companyId) })
          .sort({ order: 1 })
        const newOrder = calculateOrder(null, firstTask?.order || null)
        return newOrder === 'REBALANCE_NEEDED' ? 500 : newOrder
      } else {
        const tasks = await this.taskModel
          .find({ columnId: toObjectId(columnId), companyId: toObjectId(companyId) })
          .sort({ order: 1 })

        const taskCount = tasks.length
        if (taskCount === 0) return 1000

        return tasks[taskCount - 1].order + 1000
      }
    }

    return calculatedOrder
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
                pipeline: [
                  { $project: { name: 1, email: 1, avatar: 1, avatarColor: 1 } },
                ],
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
    select: SelectTaskDto,
  ) {
    const { limit = 10, offset = 0 } = paginationDto

    const { fields, comments } = select

    let selects = '-__v'

    if (fields) selects += ' -fields'
    if (comments) selects += ' -comments'

    const tasks = await this.taskModel
      .find({ companyId: userAuth.companyId, projectId })
      .select(selects)
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
      .populate([
        { path: 'column', select: '-__v' },
        { path: 'assignedTo', select: 'name avatar avatarColor' },
        {
          path: 'project',
          select: 'name members membersId',
          populate: {
            path: 'members',
            select: 'name avatar avatarColor',
          },
        },
      ])
      .select(select)
      .lean()

    if (!task) throw new NotFoundException('Task not found')

    return task
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
      'fields.' + formTask.fields[0].label,
      userAuth,
      this.formatDynamicField(previousField.value, formTask.fields[0]),
      this.formatDynamicField(updateFieldDto.value, formTask.fields[0]),
    )

    return updatedTask
  }

  async reorder(taskOrders: { id: string; order: number }[]) {
    const tasksById = new Map<string, any>()
    const tasksByColumn = new Map<string, any[]>()

    const taskIds = taskOrders.map((item) => toObjectId(item.id))
    const tasks = await this.taskModel.find({ _id: { $in: taskIds } })

    tasks.forEach((task) => {
      tasksById.set(task._id.toString(), task)
      const columnId = task.columnId.toString()
      if (!tasksByColumn.has(columnId)) {
        tasksByColumn.set(columnId, [])
      }
      tasksByColumn.get(columnId)!.push(task)
    })

    const orderMap = new Map(taskOrders.map((item) => [item.id, item.order]))

    const updates: any[] = []

    for (const [columnId, columnTasks] of tasksByColumn) {
      const sortedTasks = columnTasks.sort((a, b) => {
        const orderA = orderMap.get(a._id.toString()) ?? a.order
        const orderB = orderMap.get(b._id.toString()) ?? b.order
        return orderA - orderB
      })

      sortedTasks.forEach((task, index) => {
        const newOrder = (index + 1) * 1000
        updates.push({
          updateOne: {
            filter: { _id: task._id },
            update: { order: newOrder },
          },
        })
      })
    }

    if (updates.length > 0) {
      await this.taskModel.bulkWrite(updates)
    }

    return 'Tasks reordered successfully'
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

  async getRecentTaskActivity(
    userAuth: UserAuth,
    filterTaskActivityDto: FilterTaskActivityDto,
  ) {
    const { offset = 0, limit = 15, ...filters } = filterTaskActivityDto

    let activities = await this.activityModel
      .find({ ...filters, companyId: userAuth.companyId })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'task', select: 'name' },
        { path: 'user', select: 'name email avatar avatarColor' },
        { path: 'column', select: 'name color' },
      ])
      .select('text column type userId projectId createdAt')
      .skip(offset)
      .limit(limit)
      .lean()

    return activities
  }

  async getTaskActivity(
    userAuth: UserAuth,
    filterTaskActivityDto: FilterTaskActivityDto,
  ) {
    const { offset = 0, limit = 15, ...filters } = filterTaskActivityDto

    let activities = await this.activityModel
      .find({ ...filters, companyId: userAuth.companyId })
      .sort({ createdAt: -1 })
      .populate([{ path: 'user', select: 'name email avatar avatarColor' }])
      .select('-__v')
      .skip(offset)
      .limit(limit)
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
      order: '{userName} moved the task to a new position',
    }

    if (key.startsWith('fields.')) {
      const fieldId = key.split('.')[1]

      const text = `{userName} updated ${fieldId} to {newValue}`

      return await this.createActivityRecord(
        task,
        text,
        userAuth,
        previousValue,
        newValue,
      )
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

    if (task.assignedToId && task.assignedToId.toString() !== userAuth._id.toString()) {
      await this.notificationsService.sendNotification({
        userIds: [task.assignedToId],
        title: 'Task updated',
        description: text,
      })
    }

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
