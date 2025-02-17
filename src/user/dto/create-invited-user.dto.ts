import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform } from 'class-transformer'
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator'

export class CreateInvitedUserDto {
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => toObjectId(value))
  rolesId: string[]

  @IsNotEmpty()
  @IsString()
  roleType: string
}
