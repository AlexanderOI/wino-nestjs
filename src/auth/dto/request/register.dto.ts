import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterAuthDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsString({ message: 'name:Name must be a string' })
  @IsNotEmpty({ message: 'name:Name must not be empty' })
  name: string

  @ApiProperty({
    description: 'The unique username of the user',
    example: 'admin',
  })
  @IsString({ message: 'username:Username must be a string' })
  @IsNotEmpty({ message: 'username:Username must not be empty' })
  @Matches(/^\S*$/, {
    message: 'username:Username must not contain blank spaces',
  })
  userName: string

  @ApiProperty({
    description: 'The email of the user',
    example: 'admin@admin.com',
  })
  @IsEmail({}, { message: 'email:Invalid email format' })
  @IsNotEmpty({ message: 'email:Email must not be empty' })
  email: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString({ message: 'password:Password must be a string' })
  @IsNotEmpty({ message: 'password:Password must not be empty' })
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
  //   message:
  //     'password:Password must be at least 8+ characters, 1 lowercase, 1 uppercase, 1 number.',
  // })
  password: string
}
