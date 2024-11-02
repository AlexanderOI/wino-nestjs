import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true })
  description: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)
