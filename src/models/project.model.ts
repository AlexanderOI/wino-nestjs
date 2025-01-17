import { SchemaFactory } from '@nestjs/mongoose'
import { Prop, Schema } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from './company.model'
import { User } from './user.model'
import { Task } from './task.model'

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  usersTeam: User[]

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
