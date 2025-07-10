import { ApiProperty } from '@nestjs/swagger'

export class CompanyChangeResponseDto {
  @ApiProperty({
    description: 'Success message for company change',
    example: 'Successfully changed company',
  })
  message: string
}
