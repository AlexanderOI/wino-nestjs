import { ApiProperty } from '@nestjs/swagger'

export class ConflictErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 409,
  })
  statusCode: number

  @ApiProperty({
    description: 'Error message',
    example: 'Conflict',
  })
  message: string

  @ApiProperty({
    description: 'Specific error details',
    example: {
      email: ['This resource already exists'],
    },
    required: false,
  })
  details?: Record<string, string[]>
}

export class UnauthorizedErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string

  @ApiProperty({
    description: 'Error description',
    example: 'Invalid credentials',
  })
  error: string
}

export class NotFoundErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number

  @ApiProperty({
    description: 'Error message',
    example: 'Not Found',
  })
  message: string

  @ApiProperty({
    description: 'Error description',
    example: 'Resource not found',
  })
  error: string
}

export class BadRequestErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number

  @ApiProperty({
    description: 'Error message',
    example: 'Bad Request',
  })
  message: string

  @ApiProperty({
    description: 'Validation errors',
    example: [
      'property:Name must not be empty',
      'property:Invalid email format',
      'property:Password must not be empty',
    ],
    type: [String],
  })
  errors: string[]
}
