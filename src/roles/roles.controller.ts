import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'

import { User } from '@/auth/decorators/user.decorator'
import { Auth } from '@/auth/auth.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { UserAuth } from '@/types'

import { RolesService } from '@/roles/roles.service'
import { CreateRoleDto } from '@/roles/dto/create-role.dto'
import { UpdateRoleDto } from '@/roles/dto/update-role.dto'

@Controller('roles')
@Auth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth(PERMISSIONS.CREATE_ROLE)
  @Post()
  create(@User() user: UserAuth, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto, user)
  }

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.rolesService.findAll(user)
  }

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.findOne(id)
  }

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get('search')
  search(@Query('query') query: string) {
    return this.rolesService.search(query)
  }

  @Auth(PERMISSIONS.EDIT_ROLE)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: UserAuth,
  ) {
    return this.rolesService.update(id, updateRoleDto, user)
  }

  @Auth(PERMISSIONS.DELETE_ROLE)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.remove(id)
  }
}
