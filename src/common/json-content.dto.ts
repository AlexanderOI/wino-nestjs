import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class JSONContentMark {
  @IsString()
  type: string

  @IsOptional()
  attrs?: Record<string, any>
}

export class JSONContentNode {
  @IsString()
  type: string

  @IsOptional()
  attrs?: Record<string, any>

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONContentNode)
  content?: JSONContentNode[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JSONContentMark)
  marks?: JSONContentMark[]

  @IsOptional()
  @IsString()
  text?: string
}
