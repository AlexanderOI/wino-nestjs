import { Type } from 'class-transformer'
import { IsString, IsArray, IsNotEmpty, IsDate } from 'class-validator'

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  owner: string

  @IsNotEmpty()
  @IsString()
  client: string

  @IsNotEmpty()
  @IsString()
  status: string

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date
}
