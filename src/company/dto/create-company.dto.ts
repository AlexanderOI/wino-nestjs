import { IsString } from 'class-validator'

import { IsNotEmpty } from 'class-validator'

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  address: string
}
