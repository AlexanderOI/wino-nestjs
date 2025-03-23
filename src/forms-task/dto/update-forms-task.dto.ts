import { PartialType } from '@nestjs/swagger'
import { CreateFormsTaskDto } from '@/forms-task/dto/create-forms-task.dto'

export class UpdateFormsTaskDto extends PartialType(CreateFormsTaskDto) {}
