import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginAuthDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  userName: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'admin123',
  })
  @IsString()
  @IsNotEmpty()
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  password: string

  @ApiProperty({
    description: 'The company id of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyId?: string
}
