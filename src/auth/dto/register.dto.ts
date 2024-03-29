import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator'

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password must be at least: 8+ characters, 1 lowercase, 1 uppercase, 1 number.',
  })
  password: string
}
