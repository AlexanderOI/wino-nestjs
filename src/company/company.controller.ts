import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { User } from '@/auth/decorators/user.decorator'
import { Auth } from '@/auth/auth.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { UserAuth } from '@/types'

import { CreateCompanyDto } from '@/company/dto/create-company.dto'
import { UpdateCompanyDto } from '@/company/dto/update-company.dto'
import { CompanyService } from '@/company/company.service'

@Auth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Auth(PERMISSIONS.CREATE_COMPANY)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: UserAuth) {
    return this.companyService.create(createCompanyDto, user)
  }

  @Auth(PERMISSIONS.VIEW_COMPANY)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.companyService.findAll(user)
  }

  @Auth(PERMISSIONS.VIEW_COMPANY)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.companyService.findOne(id, user)
  }

  @Auth(PERMISSIONS.EDIT_COMPANY)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: UserAuth,
  ) {
    return this.companyService.update(id, updateCompanyDto, user)
  }

  @Auth(PERMISSIONS.DELETE_COMPANY)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.companyService.remove(id, user)
  }
}
