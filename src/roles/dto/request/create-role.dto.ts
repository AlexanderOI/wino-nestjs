import { IsNotEmpty, IsString, MinLength, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Project Manager',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @ApiProperty({
    description: 'A description of the role and its responsibilities',
    example: 'Manages project planning and team coordination',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string

  @ApiProperty({
    description: 'Array of permission IDs that this role will have',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  permissions: string[]
}
