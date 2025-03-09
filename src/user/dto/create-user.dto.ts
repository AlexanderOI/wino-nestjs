import { IsArray, IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { toObjectId } from '@/common/transformer.mongo-id'

import { IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  userName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => toObjectId(value))
  rolesId: string[]

  @IsString()
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  @MinLength(4)
  password: string

  @IsString()
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  @MinLength(4)
  confirmPassword: string

  @IsNotEmpty()
  @IsString()
  roleType: string
}
