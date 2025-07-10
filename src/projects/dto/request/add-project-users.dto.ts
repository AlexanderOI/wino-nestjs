import { ApiProperty } from '@nestjs/swagger'
import { toObjectId } from '@/common/transformer.mongo-id'
import { IsString, IsArray, IsNotEmpty } from 'class-validator'
import { ObjectId } from 'mongoose'
import { Transform } from 'class-transformer'

export class AddProjectUsersDto {
  @ApiProperty({
    description: 'Array of user IDs to be added as project members',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => value.map((id: string) => toObjectId(id)))
  membersId: ObjectId[]
}
