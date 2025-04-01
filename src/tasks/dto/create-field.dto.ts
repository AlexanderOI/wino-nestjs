import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { toObjectId } from '@/common/transformer.mongo-id'

export class CreateFieldDto {
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value))
  idField: string

  @IsString()
  @IsNotEmpty()
  value: string
}
