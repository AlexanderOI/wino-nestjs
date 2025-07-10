import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'

import { ApiErrors } from '@/common/decorators'
import { User } from '@/auth/decorators/user.decorator'
import { Auth } from '@/auth/auth.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { UserAuth } from '@/types'

import { RolesService } from '@/roles/roles.service'
import { CreateRoleDto, UpdateRoleDto, SearchRolesDto } from '@/roles/dto/request'
import {
  CreateRoleResponseDto,
  RoleResponseDto,
  RolesListResponseDto,
  SearchRolesResponseDto,
  UpdateRoleResponseDto,
  DeleteRoleResponseDto,
} from '@/roles/dto/response'

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@Auth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({
    summary: 'Create a new role',
    description:
      'Creates a new role with the specified permissions for the current company',
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: CreateRoleResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_ROLE)
  @Post()
  create(@User() user: UserAuth, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto, user)
  }

  @ApiOperation({
    summary: 'Get all roles',
    description: 'Retrieves all roles belonging to the current company',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: [RoleResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.rolesService.findAll(user)
  }

  @ApiOperation({
    summary: 'Search roles',
    description: 'Search roles by name or description using a search term',
  })
  @ApiQuery({
    name: 'query',
    description: 'Search term to filter roles by name or description',
    type: String,
    example: 'manager',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles found successfully',
    type: [RoleResponseDto],
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get('search')
  search(@Query('query') query: string) {
    return this.rolesService.search(query)
  }

  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Retrieves a specific role by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the role',
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: RoleResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.findOne(id)
  }

  @ApiOperation({
    summary: 'Update a role',
    description: 'Updates an existing role with new information and permissions',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the role to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: UpdateRoleResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.EDIT_ROLE)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: UserAuth,
  ) {
    return this.rolesService.update(id, updateRoleDto, user)
  }

  @ApiOperation({
    summary: 'Delete a role',
    description: 'Deletes a specific role by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the role to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
    type: DeleteRoleResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.DELETE_ROLE)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.remove(id)
  }
}
