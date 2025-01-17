import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Project } from './project.model'

@Schema({ timestamps: true })
export class ColumnTask extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, default: 0 })
  order: number

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Project

  @Prop({ default: true })
  isActive: boolean
}

export const ColumnTaskSchema = SchemaFactory.createForClass(ColumnTask)
