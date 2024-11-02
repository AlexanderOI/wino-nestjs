import { IsNotEmpty, IsString, MinLength, IsNumber } from 'class-validator'

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string

  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  permissions: number[]
}
