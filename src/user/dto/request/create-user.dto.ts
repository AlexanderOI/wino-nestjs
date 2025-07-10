import { IsArray, IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { toObjectId } from '@/common/transformer.mongo-id'

export class CreateUserDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Unique username for the user',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  userName: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Array of role IDs to assign to the user',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }) => toObjectId(value))
  rolesId: string[]

  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecurePassword123',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  password: string

  @ApiProperty({
    description: 'Password confirmation - must match password',
    example: 'SecurePassword123',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  confirmPassword: string

  @ApiProperty({
    description: 'Role type classification for the user',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  roleType: string
}
