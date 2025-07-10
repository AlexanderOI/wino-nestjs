import { toObjectId } from '@/common/transformer.mongo-id'
import { Transform } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateInvitedUserDto {
  @ApiProperty({
    description: 'Array of role IDs to assign to the invited user',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => toObjectId(value))
  rolesId: string[]

  @ApiProperty({
    description: 'Role type classification for the invited user',
    example: 'member',
  })
  @IsNotEmpty()
  @IsString()
  roleType: string
}
