import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose'

import { Task } from '@/models/task.model'
import { User } from '@/models/user.model'
import { Company } from '@/models/company.model'
import { Project } from '@/models/project.model'
import { ColumnTask } from '@/models/column-task.model'

import { JSONContent } from '@/types/json-content.type'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Activity extends Document {
  @Prop({ index: true, required: true, type: Types.ObjectId, ref: 'Task' })
  taskId: Types.ObjectId

  @Prop({ index: true, required: true, type: Task })
  task: Task

  @Prop({ index: true, required: true, type: ColumnTask })
  column: ColumnTask

  @Prop({ required: true })
  type: string

  @Prop({ type: String })
  text?: string

  @Prop({ type: MongooseSchema.Types.Mixed })
  previousValue?: JSONContent

  @Prop({ type: MongooseSchema.Types.Mixed })
  newValue?: JSONContent

  @Prop({ index: true, required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId

  @Prop({ index: true, required: true, type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId

  @Prop({ index: true, required: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId
}

export const ActivitySchema = SchemaFactory.createForClass(Activity)

ActivitySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
})

ActivitySchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true,
})

ActivitySchema.virtual('project', {
  ref: 'Project',
  localField: 'projectId',
  foreignField: '_id',
  justOne: true,
})

export interface ActivityDocument extends HydratedDocument<Activity> {
  task: Task
  user: User
  company: Company
  project: Project
}
