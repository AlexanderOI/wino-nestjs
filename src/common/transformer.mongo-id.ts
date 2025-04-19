import { BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

export function toObjectId(value: string, validate?: boolean): Types.ObjectId | null
export function toObjectId(value: string[], validate?: boolean): Types.ObjectId[]

export function toObjectId(
  value: string | string[],
  validate = true,
): Types.ObjectId | Types.ObjectId[] | null {
  const validateAndTransform = (v: string): Types.ObjectId => {
    if (!Types.ObjectId.isValid(v)) {
      if (validate) {
        throw new BadRequestException(`${v} is not a valid MongoID`)
      }
      return null
    }
    return new Types.ObjectId(v)
  }

  if (Array.isArray(value)) {
    return value.map(validateAndTransform)
  }
  return validateAndTransform(value)
}
