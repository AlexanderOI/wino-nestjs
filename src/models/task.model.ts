import { SchemaFactory } from '@nestjs/mongoose'
import { Prop, Schema } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'
import { User } from './user.model'
import { ColumnTask } from './column-task.model'
import { Project } from './project.model'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Task extends Document {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop({ type: Number, default: 0 })
  order: number

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedToId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'ColumnTask' })
  columnId: Types.ObjectId

  @Prop({ type: Date })
  startDate: Date

  @Prop({ type: Date })
  endDate: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)

TaskSchema.virtual('assignedTo', {
  ref: 'User',
  localField: 'assignedToId',
  foreignField: '_id',
  justOne: true,
})

TaskSchema.virtual('project', {
  ref: 'Project',
  localField: 'projectId',
  foreignField: '_id',
  justOne: true,
})

TaskSchema.virtual('column', {
  ref: 'ColumnTask',
  localField: 'columnId',
  foreignField: '_id',
  justOne: true,
})

export interface TaskDocument extends HydratedDocument<Task> {
  assignedTo: User
  project: Project
  column: ColumnTask
}
