import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import {
  ConflictErrorDto,
  UnauthorizedErrorDto,
  NotFoundErrorDto,
  BadRequestErrorDto,
} from './error-response.dto'

export type ErrorType = 'conflict' | 'unauthorized' | 'notFound' | 'badRequest'

interface ErrorConfig {
  type: ErrorType
  description?: string
}

const ERROR_MAPPING = {
  conflict: {
    status: HttpStatus.CONFLICT,
    dto: ConflictErrorDto,
    defaultDescription: 'Conflict - Resource already exists',
  },
  unauthorized: {
    status: HttpStatus.UNAUTHORIZED,
    dto: UnauthorizedErrorDto,
    defaultDescription: 'Unauthorized - Invalid credentials',
  },
  notFound: {
    status: HttpStatus.NOT_FOUND,
    dto: NotFoundErrorDto,
    defaultDescription: 'Not Found - Resource not found',
  },
  badRequest: {
    status: HttpStatus.BAD_REQUEST,
    dto: BadRequestErrorDto,
    defaultDescription: 'Bad Request - Validation failed',
  },
}

/**
 * Decorador para documentar errores comunes en Swagger
 * @param errors - Array de tipos de errores o configuraciones de error
 * @example
 * @ApiErrors(['notFound', 'badRequest'])
 * @ApiErrors([
 *   { type: 'notFound', description: 'User not found' },
 *   { type: 'badRequest', description: 'Invalid input data' }
 * ])
 */
export function ApiErrors(errors: (ErrorType | ErrorConfig)[]) {
  const decorators = errors.map((error) => {
    const errorConfig = typeof error === 'string' ? { type: error } : error
    const { type, description } = errorConfig
    const errorMapping = ERROR_MAPPING[type]

    return ApiResponse({
      status: errorMapping.status,
      description: description || errorMapping.defaultDescription,
      type: errorMapping.dto,
    })
  })

  return applyDecorators(...decorators)
}
