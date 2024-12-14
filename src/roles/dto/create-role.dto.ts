import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissions: string[]
}
