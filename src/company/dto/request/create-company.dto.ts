import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateCompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Solutions Inc.',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The address of the company',
    example: '123 Tech Street, Innovation City, TC 12345',
  })
  @IsString()
  @IsNotEmpty()
  address: string
}
