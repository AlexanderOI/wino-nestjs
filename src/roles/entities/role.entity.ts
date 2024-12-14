import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from 'src/auth/entities/user.entity'
import { Company } from 'src/company/entities/company.entity'
import { Permission } from 'src/permissions/entities/permission.entity'

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true })
  name: string

  @Prop()
  description: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
  permissions: Permission[]

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: User

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: User
}

export const RoleSchema = SchemaFactory.createForClass(Role)
