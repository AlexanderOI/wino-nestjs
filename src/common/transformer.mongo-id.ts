import { BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

export function toObjectId(value: string | string[]): Types.ObjectId | Types.ObjectId[] {
  const validateAndTransform = (v: string): Types.ObjectId => {
    if (!Types.ObjectId.isValid(v)) {
      throw new BadRequestException(`${v} is not a valid MongoID`)
    }
    return new Types.ObjectId(v)
  }

  if (Array.isArray(value)) {
    return value.map(validateAndTransform)
  }
  return validateAndTransform(value)
}
