import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export enum FieldType {
  Text = 'text',
  Number = 'number',
  Email = 'email',
  Select = 'select',
  Date = 'date',
  DateTime = 'datetime',
}

@Schema()
export class FieldOption {
  @Prop({ required: true })
  order: number

  @Prop({ required: true })
  value: string
}

const FieldOptionSchema = SchemaFactory.createForClass(FieldOption)

@Schema()
export class Field {
  @Prop({ required: true })
  label: string

  @Prop()
  placeholder?: string

  @Prop({ required: true, enum: FieldType })
  type: FieldType

  @Prop({ type: [FieldOptionSchema] })
  options?: FieldOption[]

  @Prop({ required: true })
  order: number
}

const FieldSchema = SchemaFactory.createForClass(Field)

@Schema({ timestamps: true })
export class FormTask extends Document {
  @Prop({ index: true, required: true })
  companyId: string

  @Prop({ required: true })
  name: string

  @Prop({ index: true, type: [FieldSchema], required: true })
  fields: Field[]

  @Prop({ required: true, default: false })
  hasProject: boolean
}

export const FormTaskSchema = SchemaFactory.createForClass(FormTask)
