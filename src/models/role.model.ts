import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Permission } from '@/models/permission.model'

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true })
  name: string

  @Prop()
  description: string

  @Prop({ index: true, type: [{ type: Types.ObjectId, ref: 'Permission' }] })
  permissions: Permission[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)
