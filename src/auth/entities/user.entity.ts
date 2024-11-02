import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Company } from 'src/company/entities/company.entity'
import { Role } from 'src/roles/entities/role.entity'

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

  @Prop({
    type: [
      {
        companyId: { type: Types.ObjectId, ref: 'Company' },
        roles: [{ type: Types.ObjectId, ref: 'Role' }],
        roleType: { type: String },
      },
    ],
  })
  companies: [
    {
      companyId: Company
      roles: Role[]
      roleType: string
    },
  ]

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
