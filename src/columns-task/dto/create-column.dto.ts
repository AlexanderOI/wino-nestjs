import { IsNotEmpty, IsString } from 'class-validator'

export class CreateColumnTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  color: string
}
