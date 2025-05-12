import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose'

import { User } from '@/models/user.model'
import { Task } from '@/models/task.model'
import { JSONContent } from '@/types/json-content.type'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Comment extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Task' })
  taskId: Types.ObjectId

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  content: JSONContent

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  parentId?: Types.ObjectId

  @Prop({ default: false })
  isEdited: boolean
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

CommentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
})

CommentSchema.virtual('task', {
  ref: 'Task',
  localField: 'taskId',
  foreignField: '_id',
  justOne: true,
})

CommentSchema.virtual('parent', {
  ref: 'Comment',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
})

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
})

export interface CommentDocument extends HydratedDocument<Comment> {
  user: User
  task: Task
  parent?: Comment
  replies?: Comment[]
  createdAt: Date
  updatedAt: Date
}
