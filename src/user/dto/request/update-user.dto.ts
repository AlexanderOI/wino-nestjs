import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Whether the user is active in the company',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean
}
