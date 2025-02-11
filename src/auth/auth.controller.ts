import { Controller, Post, Body, UseGuards, Request, Query, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterAuthDto } from './dto/register.dto'
import { LoginAuthDto } from './dto/login.dto'
import { ApiTags } from '@nestjs/swagger'
import { RefreshGuardJwt } from './guard/refresh.guard'
import { RequestWithUser } from 'types'

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

  @UseGuards(RefreshGuardJwt)
  @Post('refresh')
  refresh(@Request() req: RequestWithUser) {
    return this.authService.refreshToken(req.user)
  }

  @Get('check-user-data')
  checkUserData(@Query() userData: { userName?: string; email?: string }) {
    return this.authService.checkUserData(userData.userName, userData.email)
  }
}
