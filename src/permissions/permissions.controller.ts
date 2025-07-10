import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger'

import { PermissionsService } from '@/permissions/permissions.service'
import { ApiErrors } from '@/common/decorators/api-errors.decorator'

import { Auth } from '@/auth/auth.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'

import {
  PermissionsListResponseDto,
  SearchPermissionsResponseDto,
} from '@/permissions/dto/response'

@ApiTags('Permissions')
@ApiBearerAuth()
@Auth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({
    summary: 'Get all permissions',
    description: 'Get a complete list of all permissions available in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions list obtained successfully',
    type: [PermissionsListResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get()
  findAll() {
    return this.permissionsService.findAll()
  }

  @ApiOperation({
    summary: 'Search permissions',
    description: 'Search permissions by name or description using a search term',
  })
  @ApiQuery({
    name: 'query',
    description: 'Search term to filter permissions by name or description',
    type: String,
    example: 'view',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions found successfully',
    type: [SearchPermissionsResponseDto],
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get('search')
  search(@Query('query') query: string) {
    return this.permissionsService.search(query)
  }
}
