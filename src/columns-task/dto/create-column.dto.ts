import { IsString } from 'class-validator'

export class CreateColumnTaskDto {
  @IsString()
  name: string
}
