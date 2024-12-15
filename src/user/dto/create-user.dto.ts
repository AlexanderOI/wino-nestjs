import { IsArray, IsEmail, IsNotEmpty } from 'class-validator'

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
  @IsString({ each: true })
  roles: string[]

  @IsNotEmpty()
  @IsString()
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  password: string

  @IsNotEmpty()
  @IsString()
  roleType: string
}
