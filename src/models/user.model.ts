import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from '@/models/company.model'
import { UserCompanyRole } from '@/models/user-company-role.model'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    index: true,
  })
  name: string

  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  userName: string

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  })
  email: string

  @Prop({
    required: true,
  })
  password: string

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  currentCompanyId: Company

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserCompanyRole' }] })
  companyRoles: UserCompanyRole[]

  @Prop()
  lang: string

  @Prop()
  roleType: string

  @Prop()
  personal: boolean

  @Prop()
  createdBy: string

  @Prop()
  updatedBy: string
}

export const UserSchema = SchemaFactory.createForClass(User)
