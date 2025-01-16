import { SchemaFactory } from '@nestjs/mongoose'
import { Prop, Schema } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from './user.model'

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop()
  status: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: User
}

export const TaskSchema = SchemaFactory.createForClass(Task)
