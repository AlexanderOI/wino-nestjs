import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'
import { Company, CompanyDocument } from '@/models/company.model'
import { UserCompany } from '@/models/user-company.model'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
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
  currentCompanyId: Types.ObjectId

  @Prop()
  lang: string

  @Prop()
  personal: boolean

  @Prop({ default: 'avatar.png' })
  avatar: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('currentCompany', {
  ref: 'Company',
  localField: 'currentCompanyId',
  foreignField: '_id',
  justOne: true,
})

export interface UserDocument extends HydratedDocument<User> {
  currentCompany: CompanyDocument
}
