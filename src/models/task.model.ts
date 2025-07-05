import { SchemaFactory } from '@nestjs/mongoose'
import { Prop, Schema } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose'

import { User } from '@/models/user.model'
import { Project } from '@/models/project.model'
import { ColumnTask } from '@/models/column-task.model'
import { JSONContent } from '@/types/json-content.type'

@Schema({ timestamps: true })
export class Field {
  @Prop({ required: true, type: Types.ObjectId })
  idField: Types.ObjectId

  @Prop({ required: true })
  value: string
}

const FieldSchema = SchemaFactory.createForClass(Field)

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Task extends Document {
  @Prop()
  name: string

  @Prop({ type: MongooseSchema.Types.Mixed })
  description: JSONContent

  @Prop({ type: Number, default: 0 })
  code: number

  @Prop({ type: Number, default: 0 })
  order: number

  @Prop({ index: true, type: Types.ObjectId, ref: 'User' })
  assignedToId: Types.ObjectId

  @Prop({ index: true, type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId

  @Prop({ index: true, type: Types.ObjectId, ref: 'ColumnTask' })
  columnId: Types.ObjectId

  @Prop({ index: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId

  @Prop({ type: [FieldSchema] })
  fields: Field[]
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
