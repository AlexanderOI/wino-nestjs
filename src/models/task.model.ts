import { SchemaFactory } from '@nestjs/mongoose'
import { Prop, Schema } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from './user.model'
import { ColumnTask } from './column-task.model'
import { Project } from './project.model'

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop({ type: Number, default: 0 })
  order: number

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: User

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId: Project

  @Prop({ type: Types.ObjectId, ref: 'ColumnTask' })
  columnId: ColumnTask

  @Prop({ type: Date })
  startDate: Date

  @Prop({ type: Date })
  endDate: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)
