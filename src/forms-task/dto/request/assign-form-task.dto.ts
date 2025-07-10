import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class AssignFormTaskDto {
  @ApiProperty({
    description: 'The ID of the project to assign the form task to',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  projectId: Types.ObjectId
}
