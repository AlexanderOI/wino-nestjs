import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator'

export class RegisterAuthDto {
  @IsString({ message: 'name:Name must be a string' })
  @IsNotEmpty({ message: 'name:Name must not be empty' })
  name: string

  @IsString({ message: 'username:Username must be a string' })
  @IsNotEmpty({ message: 'username:Username must not be empty' })
  @Matches(/^\S*$/, {
    message: 'username:Username must not contain blank spaces',
  })
  userName: string

  @IsEmail({}, { message: 'email:Invalid email format' })
  @IsNotEmpty({ message: 'email:Email must not be empty' })
  email: string

  @IsString({ message: 'password:Password must be a string' })
  @IsNotEmpty({ message: 'password:Password must not be empty' })
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
  //   message:
  //     'password:Password must be at least 8+ characters, 1 lowercase, 1 uppercase, 1 number.',
  // })
  password: string
}
