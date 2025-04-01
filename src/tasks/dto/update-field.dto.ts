import { PartialType } from '@nestjs/swagger'
import { CreateFieldDto } from '@/tasks/dto/create-field.dto'

export class UpdateFieldDto extends PartialType(CreateFieldDto) {}
