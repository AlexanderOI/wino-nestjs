import { ApiProperty } from '@nestjs/swagger'
import { CreateProjectResponseDto } from './create-project-response.dto'

export class UpdateProjectResponseDto extends CreateProjectResponseDto {
  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date
}
