import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument, Types } from 'mongoose'
import { CompanyDocument } from '@/models/company.model'

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

  @Prop({ index: true, type: Types.ObjectId, ref: 'Company' })
  currentCompanyId: Types.ObjectId

  @Prop()
  lang: string

  @Prop()
  personal: boolean

  @Prop()
  avatar: string

  @Prop({ default: '#52555E' })
  avatarColor: string
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
