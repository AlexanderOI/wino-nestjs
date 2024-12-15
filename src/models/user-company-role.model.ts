import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '@/models/user.model'
import { Company } from '@/models/company.model'
import { Role } from '@/models/role.model'

@Schema({ timestamps: true })
export class UserCompanyRole extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  company: Company

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Role[]

  @Prop({ default: false })
  isActive: boolean

  @Prop()
  createdBy: string

  @Prop()
  updatedBy: string
}

export const UserCompanyRoleSchema = SchemaFactory.createForClass(UserCompanyRole)
