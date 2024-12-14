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
import { Auth } from 'src/auth/auth.decorator'
import { RequestWithUser } from 'types'
import { ParseMongoIdPipe } from 'src/common/parse-mongo-id.pipe'

@Auth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req: RequestWithUser) {
    return this.companyService.create(createCompanyDto, req.user)
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.companyService.findAll(req.user.id)
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.companyService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req: RequestWithUser,
  ) {
    return this.companyService.update(id, updateCompanyDto, req.user)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.companyService.remove(id)
  }
}
