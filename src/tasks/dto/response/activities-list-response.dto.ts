import { ApiProperty } from '@nestjs/swagger'
import { ActivityResponseDto } from './activity-response.dto'

export class ActivitiesListResponseDto {
  @ApiProperty({
    description: 'Array of task activities',
    type: [ActivityResponseDto],
  })
  activities: ActivityResponseDto[]

  @ApiProperty({
    description: 'Total number of activities',
    example: 50,
  })
  total: number
}
