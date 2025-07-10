import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateColumnDto {
  @ApiProperty({
    description: 'The name of the column',
    example: 'Column 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The color of the column in hex format',
    example: '#000000',
  })
  @IsString()
  @IsNotEmpty()
  color: string
}
