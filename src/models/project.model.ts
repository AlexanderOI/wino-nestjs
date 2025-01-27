import { SchemaFactory } from '@nestjs/mongoose'
import { Prop, Schema } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'
import { Company } from './company.model'
import { User } from './user.model'
import { Task } from './task.model'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Project extends Document {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  leaderId: Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  membersId: Types.ObjectId[]

  @Prop()
  client: string

  @Prop()
  status: string

  @Prop()
  startDate: Date

  @Prop()
  endDate: Date

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  company: Company
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

export interface ProjectDocument extends HydratedDocument<Project> {
  members: User[]
  leader: User
}
