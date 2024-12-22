import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '@/models/user.model'
import { Role } from '@/models/role.model'
import { UserCompany } from './user-company.model'

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  name: String

  @Prop()
  address: String

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Role[]

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserCompany' }] })
  usersCompany: UserCompany[]

  @Prop({ default: false })
  isMain: Boolean

  @Prop()
  createdBy: string

  @Prop()
  updatedBy: string
}

export const CompanySchema = SchemaFactory.createForClass(Company)
