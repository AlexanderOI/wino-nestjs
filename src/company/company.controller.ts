import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger'

import { User } from '@/auth/decorators/user.decorator'
import { Auth } from '@/auth/auth.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { ApiErrors } from '@/common/decorators/api-errors.decorator'
import { UserAuth } from '@/types'

import { CreateCompanyDto, UpdateCompanyDto } from '@/company/dto/request'

import {
  CreateCompanyResponseDto,
  CompanyWithUserInfoResponseDto,
  UpdateCompanyResponseDto,
  DeleteCompanyResponseDto,
} from '@/company/dto/response'

import { CompanyService } from '@/company/company.service'

@ApiTags('Companies')
@ApiBearerAuth()
@Auth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({
    summary: 'Create a new company',
    description:
      'Creates a new company with the authenticated user as owner. An admin role with all permissions is automatically created and assigned to the user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: CreateCompanyResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_COMPANY)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: UserAuth) {
    return this.companyService.create(createCompanyDto, user)
  }

  @ApiOperation({
    summary: 'Get all companies',
    description:
      'Retrieves all companies where the authenticated user is owner or member, including user-specific information like role and status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Companies retrieved successfully',
    type: [CompanyWithUserInfoResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_COMPANY)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.companyService.findAll(user)
  }

  @ApiOperation({
    summary: 'Get company by ID',
    description:
      'Retrieves a specific company by its ID with owner information and user-company relationship details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Company retrieved successfully',
    type: CreateCompanyResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to retrieve',
    type: 'string',
  })
  @Auth(PERMISSIONS.VIEW_COMPANY)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.companyService.findOne(id, user)
  }

  @ApiOperation({
    summary: 'Update a company',
    description:
      'Updates an existing company. Only the company owner can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    type: UpdateCompanyResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to update',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_COMPANY)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: UserAuth,
  ) {
    return this.companyService.update(id, updateCompanyDto, user)
  }

  @ApiOperation({
    summary: 'Delete a company',
    description:
      'Permanently deletes a company and all its associated data. Only the company owner can perform this action. This action cannot be undone.',
  })
  @ApiResponse({
    status: 200,
    description: 'Company deleted successfully',
    type: DeleteCompanyResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the company to delete',
    type: 'string',
  })
  @Auth(PERMISSIONS.DELETE_COMPANY)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.companyService.remove(id, user)
  }
}
