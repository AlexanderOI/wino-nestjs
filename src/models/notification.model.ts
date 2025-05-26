import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'

import { User } from '@/models/user.model'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Notification extends Document {
  @Prop({ required: true, type: [Types.ObjectId], ref: 'User' })
  userIds: Types.ObjectId[]

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: false })
  link: string

  @Prop({ default: false })
  read: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)

NotificationSchema.virtual('users', {
  ref: 'User',
  localField: 'userIds',
  foreignField: '_id',
})

export interface NotificationDocument extends HydratedDocument<Notification> {
  users: User[]
  createdAt: Date
  updatedAt: Date
}
