import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  login(@Body() userRegister: RegisterAuthDto) {
    return this.authService.register(userRegister)
  }

  @Post('login')
  register(@Body() userLogin: LoginAuthDto) {
    return this.authService.login(userLogin)
  }
}
