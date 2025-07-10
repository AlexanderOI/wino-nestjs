import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { UserAuth } from '@/types'
import { toObjectId } from '@/common/transformer.mongo-id'
import { calculateOrder } from '@/common/utils/calculate-order'

import { Task } from '@/models/task.model'
import { ColumnTask } from '@/models/column-task.model'
import { CreateColumnDto, UpdateColumnDto } from '@/columns-task/dto/request'

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(ColumnTask.name) private columnTaskModel: Model<ColumnTask>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async createDefaultColumns(projectId: unknown, companyId: string | Types.ObjectId) {
    const defaultColumns = [
      { name: 'Pending', color: '#0000ff', order: 1000 },
      { name: 'In Progress', color: '#ffff00', order: 2000 },
      { name: 'Paused', color: '#868179', order: 3000 },
      { name: 'Completed', color: '#00ff00', order: 90000, completed: true },
    ]

    const columns = await Promise.all(
      defaultColumns.map((col) =>
        this.columnTaskModel.create({
          ...col,
          projectId,
          companyId,
        }),
      ),
    )

    return columns
  }

  async create(projectId: string, createColumnDto: CreateColumnDto, user: UserAuth) {
    const lastColumn = await this.columnTaskModel
      .findOne({ projectId })
      .sort({ order: -1 })

    const newOrder = lastColumn ? lastColumn.order + 1000 : 1000

    const newColumn = await this.columnTaskModel.create({
      ...createColumnDto,
      projectId,
      companyId: user.companyId,
      order: newOrder,
    })

    lastColumn.order = newOrder + 1000
    await lastColumn.save()

    return newColumn
  }

  async createAtPosition(
    projectId: string,
    createColumnDto: CreateColumnDto,
    insertAfterColumnId: string | null = null,
  ) {
    let newOrder: number

    if (insertAfterColumnId === null) {
      const firstColumn = await this.columnTaskModel
        .findOne({ projectId })
        .sort({ order: 1 })

      const calculatedOrder = calculateOrder(null, firstColumn?.order || null)
      newOrder = calculatedOrder === 'REBALANCE_NEEDED' ? 500 : calculatedOrder
    } else {
      const currentColumn = await this.columnTaskModel.findById(insertAfterColumnId)
      if (!currentColumn) throw new NotFoundException('Column not found')

      const nextColumn = await this.columnTaskModel
        .findOne({ projectId, order: { $gt: currentColumn.order } })
        .sort({ order: 1 })

      const calculatedOrder = calculateOrder(
        currentColumn.order,
        nextColumn?.order || null,
      )
      newOrder =
        calculatedOrder === 'REBALANCE_NEEDED'
          ? currentColumn.order + 1000
          : calculatedOrder
    }

    const newColumn = await this.columnTaskModel.create({
      ...createColumnDto,
      projectId,
      order: newOrder,
    })

    return newColumn
  }

  async findOne(columnId: string) {
    const column = await this.columnTaskModel.findById(columnId)

    if (!column) throw new NotFoundException('Column not found')

    return column
  }

  async update(columnId: string, updateColumnDto: UpdateColumnDto) {
    const column = await this.columnTaskModel.findById(columnId)
    if (!column) throw new NotFoundException('Column not found')

    if (column.completed) {
      throw new BadRequestException('Cannot update completed column')
    }

    const updatedColumn = await this.columnTaskModel.findByIdAndUpdate(
      columnId,
      updateColumnDto,
      {
        new: true,
      },
    )

    return updatedColumn
  }

  async remove(columnId: string) {
    const column = await this.columnTaskModel.findById(columnId)
    if (!column) throw new NotFoundException('Column not found')

    if (column.completed) {
      throw new BadRequestException('Cannot delete completed column')
    }

    await column.deleteOne()
    await this.taskModel.deleteMany({ columnId: columnId })

    return { message: 'Column and tasks deleted successfully' }
  }

  async findByProject(projectId: string, withTasks = false) {
    if (!withTasks) {
      return this.columnTaskModel.find({ projectId, isActive: true }).sort({ order: 1 })
    }

    const columnsWithTasks = await this.columnTaskModel.aggregate([
      {
        $match: {
          projectId: new Types.ObjectId(projectId),
          isActive: true,
        },
      },
      {
        $sort: { order: 1 },
      },
      {
        $lookup: {
          from: 'tasks',
          let: { columnId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$columnId', '$$columnId'],
                },
              },
            },
            { $sort: { order: 1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: 'assignedToId',
                foreignField: '_id',
                as: 'assignedTo',
              },
            },
            {
              $unwind: {
                path: '$assignedTo',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                name: 1,
                description: 1,
                code: 1,
                order: 1,
                columnId: 1,
                assignedToId: 1,
                assignedTo: {
                  name: 1,
                  avatar: 1,
                  avatarColor: 1,
                },
              },
            },
          ],
          as: 'tasks',
        },
      },
    ])

    return columnsWithTasks
  }

  async reorder(projectId: string, columnOrders: { id: string; order: number }[]) {
    const columns = await this.columnTaskModel.find({ projectId }).sort({ order: 1 })

    const orderMap = new Map(columnOrders.map((item) => [item.id, item.order]))

    const sortedColumns = columns.sort((a, b) => {
      const orderA = orderMap.get(a._id.toString()) ?? a.order
      const orderB = orderMap.get(b._id.toString()) ?? b.order
      return orderA - orderB
    })

    const completedColumn = sortedColumns.find((column) => column.completed)
    if (completedColumn) {
      const completedColumnIndex = sortedColumns.findIndex((column) => column.completed)
      const isLastColumn = completedColumnIndex === sortedColumns.length - 1

      if (!isLastColumn) {
        throw new BadRequestException('Completed column must be at the end')
      }
    }

    const updates = sortedColumns.map((column, index) => ({
      updateOne: {
        filter: { _id: column._id },
        update: { order: (index + 1) * 1000 },
      },
    }))

    await this.columnTaskModel.bulkWrite(updates)

    return this.findByProject(projectId)
  }

  async getTotalTaskPerColumns(user: UserAuth, projectId?: string) {
    const matchFilter: any = {
      companyId: user.companyId,
    }
    if (projectId) matchFilter.projectId = toObjectId(projectId)

    const columnsWithTasksCount = await this.columnTaskModel.aggregate([
      { $match: { ...matchFilter, isActive: true } },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'columnId',
          as: 'tasks',
          pipeline: [
            {
              $match: matchFilter,
            },
          ],
        },
      },
      {
        $addFields: {
          tasksCount: { $size: '$tasks' },
        },
      },
      {
        $project: {
          tasks: 0,
        },
      },
    ])

    return columnsWithTasksCount
  }

  async deleteAllColumns(projectId: unknown) {
    const columns = this.columnTaskModel.deleteMany({ projectId })
    const tasks = this.taskModel.deleteMany({ projectId })

    await Promise.all([columns, tasks])

    return { message: 'All columns and tasks deleted successfully' }
  }
}
