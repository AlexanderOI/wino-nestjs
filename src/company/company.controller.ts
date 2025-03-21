import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common'
import { CompanyService } from './company.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Auth } from '@/auth/auth.decorator'
import { RequestWithUser } from 'types'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PERMISSIONS } from '@/permissions/constants/permissions'

@Auth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Auth(PERMISSIONS.CREATE_COMPANY)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req: RequestWithUser) {
    return this.companyService.create(createCompanyDto, req.user)
  }

  @Auth(PERMISSIONS.VIEW_COMPANY)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.companyService.findAll(req.user._id)
  }

  @Auth(PERMISSIONS.VIEW_COMPANY)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.companyService.findOne(id, req.user)
  }

  @Auth(PERMISSIONS.EDIT_COMPANY)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req: RequestWithUser,
  ) {
    return this.companyService.update(id, updateCompanyDto, req.user)
  }

  @Auth(PERMISSIONS.DELETE_COMPANY)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.companyService.remove(id, req.user)
  }
}
