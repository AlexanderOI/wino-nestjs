import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { ColumnTask } from '@/models/column-task.model'
import { Task } from '@/models/task.model'
import { CreateColumnTaskDto } from './dto/create-column.dto'
import { UpdateColumnTaskDto } from './dto/update-column.dto'
import { UserAuth } from '@/types'
import { toObjectId } from '@/common/transformer.mongo-id'

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(ColumnTask.name) private columnTaskModel: Model<ColumnTask>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async createDefaultColumns(projectId: unknown, companyId: string | Types.ObjectId) {
    const defaultColumns = [
      { name: 'Pending', color: '#0000ff', order: 0 },
      { name: 'In Progress', color: '#ffff00', order: 1 },
      { name: 'Paused', color: '#868179', order: 2 },
      { name: 'Completed', color: '#00ff00', order: 3 },
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

  async create(projectId: string, createColumnDto: CreateColumnTaskDto) {
    const lastColumn = await this.columnTaskModel
      .findOne({ projectId })
      .sort({ order: -1 })

    const newOrder = lastColumn ? lastColumn.order + 1 : 0

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

  async update(columnId: string, updateColumnDto: UpdateColumnTaskDto) {
    const column = await this.columnTaskModel.findByIdAndUpdate(
      columnId,
      updateColumnDto,
      {
        new: true,
      },
    )
    if (!column) throw new NotFoundException('Column not found')

    return column
  }

  async remove(columnId: string) {
    const column = await this.columnTaskModel.findById(columnId)
    if (!column) throw new NotFoundException('Column not found')

    await column.deleteOne()
    await this.taskModel.deleteMany({ columnId: columnId })

    return { message: 'Column and tasks deleted successfully' }
  }

  async findByProject(projectId: string, withTasks: boolean = false) {
    const columns = await this.columnTaskModel
      .find({ projectId, isActive: true })
      .sort({ order: 1 })

    if (withTasks) {
      const columnsWithTasks = await Promise.all(
        columns.map(async (column) => {
          const tasks = await this.taskModel
            .find({ columnId: column._id })
            .populate([
              {
                path: 'assignedTo',
                select: 'name avatar avatarColor',
              },
            ])
            .select('name description code order assignedToId assignedTo')
            .sort({ order: 1 })
          return { ...column.toObject(), tasks }
        }),
      )

      return columnsWithTasks
    }

    return columns
  }

  async reorder(projectId: string, columnOrders: { id: string; order: number }[]) {
    await Promise.all(
      columnOrders.map(({ id, order }) =>
        this.columnTaskModel.findByIdAndUpdate(id, { order }),
      ),
    )

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
