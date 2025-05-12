import { IsBoolean, IsOptional } from 'class-validator'

export class SelectTaskDto {
  @IsOptional()
  @IsBoolean()
  fields?: boolean

  @IsOptional()
  @IsBoolean()
  comments?: boolean
}
