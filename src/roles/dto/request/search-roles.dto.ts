import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SearchRolesDto {
  @ApiProperty({
    description: 'Search term to filter roles by name or description',
    example: 'manager',
  })
  @IsString()
  @IsNotEmpty()
  query: string
}
