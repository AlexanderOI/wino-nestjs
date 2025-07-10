import { PartialType } from '@nestjs/swagger'
import { CreateCompanyDto } from '@/company/dto/request/create-company.dto'

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
