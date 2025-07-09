import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Project } from './project.model'

@Schema({ timestamps: true })
export class ColumnTask extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, default: 0 })
  order: number

  @Prop({ required: true, default: '#00FF00' })
  color: string

  @Prop({ required: true, default: false })
  completed: boolean

  @Prop({ index: true, type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId

  @Prop({ index: true, type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Project

  @Prop({ default: true })
  isActive: boolean
}

export const ColumnTaskSchema = SchemaFactory.createForClass(ColumnTask)
