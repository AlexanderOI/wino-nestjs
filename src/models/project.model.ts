import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'

import { User } from '@/models/user.model'
import { Company } from '@/models/company.model'
import { FormTask } from '@/models/form-task.model'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Project extends Document {
  @Prop({ index: true, required: true })
  name: string

  @Prop({ index: true, required: true })
  code: string

  @Prop()
  description: string

  @Prop({ index: true, type: Types.ObjectId, ref: 'User' })
  leaderId: Types.ObjectId

  @Prop({ index: true, type: [{ type: Types.ObjectId, ref: 'User' }] })
  membersId: Types.ObjectId[]

  @Prop()
  client: string

  @Prop()
  status: string

  @Prop({ index: true, type: Types.ObjectId, ref: 'FormTask' })
  formTaskId: Types.ObjectId

  @Prop()
  startDate: Date

  @Prop()
  endDate: Date

  @Prop({ index: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId
}

export const ProjectSchema = SchemaFactory.createForClass(Project)

ProjectSchema.virtual('members', {
  ref: 'User',
  localField: 'membersId',
  foreignField: '_id',
  justOne: false,
})

ProjectSchema.virtual('leader', {
  ref: 'User',
  localField: 'leaderId',
  foreignField: '_id',
  justOne: true,
})

ProjectSchema.virtual('formTask', {
  ref: 'FormTask',
  localField: 'formTaskId',
  foreignField: '_id',
  justOne: true,
})

ProjectSchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true,
})

export interface ProjectDocument extends HydratedDocument<Project> {
  members: User[]
  leader: User
  company: Company
  formTask: FormTask
}
