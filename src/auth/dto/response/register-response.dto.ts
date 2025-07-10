import { ApiProperty } from '@nestjs/swagger'

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Confirmation message of the registration',
    example: 'User registered successfully',
  })
  message: string
}

export class CheckUserDataResponseDto {
  @ApiProperty({
    description: 'Validation message of the user data',
    example: 'User data is valid',
  })
  message: string
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'New JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string

  @ApiProperty({
    description: 'Expiration time of the token in timestamp',
    example: 1640995200000,
  })
  expiresIn: number
}
