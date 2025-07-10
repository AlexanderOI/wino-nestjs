import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiErrors } from '@/common/decorators'

import { User } from '@/auth/decorators/user.decorator'
import { RefreshGuardJwt } from '@/auth/guard/refresh.guard'
import { UserAuth } from '@/types'
import {
  RegisterAuthDto,
  LoginAuthDto,
  CheckUserDataQueryDto,
  LoginResponseDto,
  RegisterResponseDto,
  CheckUserDataResponseDto,
  RefreshTokenResponseDto,
} from '@/auth/dto'
import { AuthService } from '@/auth/auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user in the system with default company and role',
  })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiErrors(['conflict', 'badRequest'])
  @Post('register')
  register(@Body() userRegister: RegisterAuthDto): Promise<RegisterResponseDto> {
    return this.authService.register(userRegister)
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Authenticate the user and return access tokens',
  })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Post('login')
  login(@Body() userLogin: LoginAuthDto): Promise<LoginResponseDto> {
    return this.authService.login(userLogin)
  }

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Generate new access tokens using the refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: RefreshTokenResponseDto,
  })
  @ApiErrors(['unauthorized'])
  @UseGuards(RefreshGuardJwt)
  @Post('refresh')
  refresh(@User() req: UserAuth): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(req)
  }

  @ApiOperation({
    summary: 'Check user data availability',
    description: 'Check if a username or email is already in use',
  })
  @ApiResponse({
    status: 200,
    description: 'User data is valid',
    type: CheckUserDataResponseDto,
  })
  @ApiErrors(['conflict'])
  @Get('check-user-data')
  checkUserData(
    @Query() userData: CheckUserDataQueryDto,
  ): Promise<CheckUserDataResponseDto> {
    return this.authService.checkUserData(userData.userName, userData.email)
  }
}
