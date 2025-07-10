import { ApiProperty } from '@nestjs/swagger'

export class UserOperationResponseDto {
  @ApiProperty({
    description: 'Success message for the operation',
    example: 'User updated successfully',
  })
  message: string
}
