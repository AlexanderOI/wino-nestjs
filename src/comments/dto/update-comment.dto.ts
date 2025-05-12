import { IsNotEmpty, IsOptional } from 'class-validator'
import { JSONContent } from '@/types/json-content.type'

export class UpdateCommentDto {
  @IsOptional()
  @IsNotEmpty()
  content?: JSONContent
}
