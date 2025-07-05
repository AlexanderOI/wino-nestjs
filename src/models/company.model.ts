import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, HydratedDocument } from 'mongoose'
import { User } from '@/models/user.model'
import { Role } from '@/models/role.model'
import { UserCompany } from '@/models/user-company.model'

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Company extends Document {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  name: String

  @Prop()
  address: String

  @Prop({ index: true, type: [{ type: Types.ObjectId, ref: 'Role' }] })
  rolesId: Types.ObjectId[]

  @Prop({ index: true, type: Types.ObjectId, ref: 'User' })
  owner: User

  @Prop({ index: true, type: [{ type: Types.ObjectId, ref: 'UserCompany' }] })
  usersCompany: UserCompany[]

  @Prop({ default: false })
  isMain: Boolean
}

export const CompanySchema = SchemaFactory.createForClass(Company)

CompanySchema.virtual('roles', {
  ref: 'Role',
  localField: 'rolesId',
  foreignField: '_id',
})

export interface CompanyDocument extends HydratedDocument<Company> {
  roles: Role[]
}
