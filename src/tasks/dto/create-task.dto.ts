import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  assignedTo: string

  @IsNumber()
  @IsOptional()
  order: number

  @IsString()
  @IsNotEmpty()
  columnId: string

  @IsString()
  @IsNotEmpty()
  projectId: string
}
