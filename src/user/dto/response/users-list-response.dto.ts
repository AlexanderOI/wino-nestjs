import { ApiProperty } from '@nestjs/swagger'
import { UserResponseDto } from './user-response.dto'

export class UsersListResponseDto {
  @ApiProperty({
    description: 'Array of users in the company',
    type: [UserResponseDto],
  })
  users: UserResponseDto[]

  @ApiProperty({
    description: 'Total number of users',
    example: 15,
  })
  total: number
}
