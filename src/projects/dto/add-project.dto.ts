import { IsString, IsArray, IsNotEmpty } from 'class-validator'

export class AddProjectUsersDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  users: string[]
}
