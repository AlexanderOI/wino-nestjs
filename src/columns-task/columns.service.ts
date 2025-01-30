import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ColumnTask } from '@/models/column-task.model'
import { Task } from '@/models/task.model'
import { CreateColumnTaskDto } from './dto/create-column.dto'
import { UpdateColumnTaskDto } from './dto/update-column.dto'

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(ColumnTask.name) private columnTaskModel: Model<ColumnTask>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async createDefaultColumns(projectId: unknown) {
    const defaultColumns = [
      { name: 'Pending', color: '#FF6B6B', order: 0 },
      { name: 'In Progress', color: '#FFD93D', order: 1 },
      { name: 'Paused', color: '#6C5CE7', order: 2 },
      { name: 'Completed', color: '#27AE60', order: 3 },
    ]

    const columns = await Promise.all(
      defaultColumns.map((col) =>
        this.columnTaskModel.create({
          ...col,
          projectId,
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

  async update(columnId: string, updateColumnDto: UpdateColumnTaskDto) {
    const column = await this.columnTaskModel.findByIdAndUpdate(
      columnId,
      updateColumnDto,
      {
        new: true,
      },
    )
    if (!column) throw new NotFoundException('Columna no encontrada')

    return column
  }

  async remove(columnId: string) {
    const column = await this.columnTaskModel.findById(columnId)
    if (!column) throw new NotFoundException('Columna no encontrada')

    const tasksInColumn = await this.taskModel.countDocuments({ columnId })
    if (tasksInColumn > 0) {
      throw new BadRequestException('No se puede eliminar una columna con tareas')
    }

    await column.deleteOne()
    return { message: 'Columna eliminada exitosamente' }
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
}
