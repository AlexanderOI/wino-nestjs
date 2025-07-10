import { ApiProperty } from '@nestjs/swagger'

export class UploadAvatarResponseDto {
  @ApiProperty({
    description: 'URL of the uploaded avatar image',
    example: 'https://res.cloudinary.com/example/image/upload/v1234567890/avatar.jpg',
  })
  url: string
}
