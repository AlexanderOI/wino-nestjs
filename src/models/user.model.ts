import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from '@/models/company.model'
import { UserCompany } from '@/models/user-company.model'

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

  @Prop()
  lang: string

  @Prop()
  personal: boolean

  @Prop()
  createdBy: string

  @Prop()
  updatedBy: string
}

export const UserSchema = SchemaFactory.createForClass(User)
