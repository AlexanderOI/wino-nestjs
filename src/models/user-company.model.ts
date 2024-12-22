import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '@/models/user.model'
import { Role } from '@/models/role.model'
import { Company } from './company.model'

@Schema({ timestamps: true })
export class UserCompany extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  company: Company

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Role[]

  @Prop()
  roleType: string

  @Prop({ default: true })
  isActive: boolean

  @Prop()
  createdBy: string

  @Prop()
  updatedBy: string
}

export const UserCompanySchema = SchemaFactory.createForClass(UserCompany)
