import { ApiProperty } from '@nestjs/swagger'
import { CreateCompanyResponseDto } from '@/company/dto/response/create-company-response.dto'

export class CompanyWithUserInfoResponseDto extends CreateCompanyResponseDto {
  @ApiProperty({
    description: 'Whether the user is active in this company',
    example: true,
    required: false,
  })
  isActive?: boolean

  @ApiProperty({
    description: 'Role type of the user in this company',
    example: 'admin',
    enum: ['admin', 'member', 'viewer'],
    required: false,
  })
  roleType?: string

  @ApiProperty({
    description: 'Whether the user was invited to this company',
    example: false,
    required: false,
  })
  isInvited?: boolean

  @ApiProperty({
    description: 'Whether the user has a pending invitation',
    example: false,
    required: false,
  })
  invitePending?: boolean
}

export class UpdateCompanyResponseDto extends CreateCompanyResponseDto {
  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date
}

export class DeleteCompanyResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Company deleted successfully',
  })
  message: string
}
