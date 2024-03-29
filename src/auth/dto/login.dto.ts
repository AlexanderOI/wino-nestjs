import { IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator'

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password must be at least: 8+ characters, 1 lowercase, 1 uppercase, 1 number.',
  })
  password: string
}
