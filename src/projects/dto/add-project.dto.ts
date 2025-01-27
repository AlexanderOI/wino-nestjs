import { toObjectId } from '@/common/transformer.mongo-id'
import { IsString, IsArray, IsNotEmpty } from 'class-validator'
import { ObjectId } from 'mongoose'
import { Transform } from 'class-transformer'

export class AddProjectUsersDto {
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => value.map((id: string) => toObjectId(id)))
  membersId: ObjectId[]
}
