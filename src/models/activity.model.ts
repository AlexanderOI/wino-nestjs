import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'
import { Task } from './task.model'
import { User } from './user.model'
import { Company } from './company.model'
import { Project } from './project.model'
import { ColumnTask } from './column-task.model'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Activity extends Document {
  @Prop({ required: true, type: Task })
  task: Task

  @Prop({ required: true, type: ColumnTask })
  column: ColumnTask

  @Prop({ required: true })
  type: string

  @Prop({ type: String })
  text?: string

  @Prop({ type: String })
  previousValue?: string

  @Prop({ type: String })
  newValue?: string

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'Company' })
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
