import { ApiProperty } from '@nestjs/swagger'

export class AuthTokensDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string

  @ApiProperty({
    description: 'Expiration time of the token in timestamp',
    example: 1640995200000,
  })
  expiresIn: number
}

export class UserPayloadDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  name: string

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'juanperez',
  })
  userName: string

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
  })
  email: string

  @ApiProperty({
    description: 'URL del avatar del usuario',
    example: 'https://avatar.example.com/user.jpg',
    required: false,
  })
  avatar?: string

  @ApiProperty({
    description: 'Tipo de rol del usuario',
    example: 'admin',
  })
  roleType: string

  @ApiProperty({
    description: 'ID de la empresa actual',
    example: '507f1f77bcf86cd799439012',
  })
  companyId: string

  @ApiProperty({
    description: 'Nombre de la empresa actual',
    example: 'Mi Empresa',
  })
  companyName: string

  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Calle 123, Ciudad',
    required: false,
  })
  companyAddress?: string

  @ApiProperty({
    description: 'Lista de permisos del usuario',
    example: ['read:users', 'write:users', 'delete:users'],
    type: [String],
  })
  permissions: string[]
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Datos del usuario autenticado',
    type: UserPayloadDto,
  })
  user: UserPayloadDto

  @ApiProperty({
    description: 'Tokens de autenticación',
    type: AuthTokensDto,
  })
  backendTokens: AuthTokensDto
}
