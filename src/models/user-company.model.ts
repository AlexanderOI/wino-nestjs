import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, HydratedDocument } from 'mongoose'
import { User } from '@/models/user.model'
import { Role } from '@/models/role.model'
import { Company } from './company.model'

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: { virtuals: true },
})
export class UserCompany extends Document {
  @Prop({ index: true, type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop({ index: true, type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId

  @Prop({ index: true, type: [{ type: Types.ObjectId, ref: 'Role' }] })
  rolesId: Types.ObjectId[]

  @Prop()
  roleType: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: false })
  isInvited: boolean

  @Prop({ default: false })
  invitePending: boolean
}

export const UserCompanySchema = SchemaFactory.createForClass(UserCompany)

UserCompanySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
})

UserCompanySchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true,
})

UserCompanySchema.virtual('roles', {
  ref: 'Role',
  localField: 'rolesId',
  foreignField: '_id',
})

export interface UserCompanyDocument extends HydratedDocument<UserCompany> {
  user: User
  company: Company
  roles: Role[]
  createdAt: Date
  updatedAt: Date
}
