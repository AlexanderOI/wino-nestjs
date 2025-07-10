import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CheckUserDataQueryDto {
  @ApiProperty({
    description: 'Username to check',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  userName?: string

  @ApiProperty({
    description: 'Email to check',
    example: 'admin@admin.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string
}
