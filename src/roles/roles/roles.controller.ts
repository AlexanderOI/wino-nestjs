import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RequestWithUser } from 'types'
import { PermissionsGuard } from 'src/permissions/permissions.guard'
import { Auth } from 'src/auth/auth.decorator'
import { AuthGuardJwt } from 'src/auth/auth.guard'
import { Permissions } from 'src/permissions/permissions.decorator'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  // @UseGuards(AuthGuardJwt, PermissionsGuard)
  // @Permissions(['admin'])
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  // @UseGuards(AuthGuardJwt, PermissionsGuard)
  // @Permissions(['admin'])
  findAll(@Request() req: RequestWithUser) {
    return this.rolesService.findAll()
  }

  @Get('h')
  find() {
    return this.rolesService.find()
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.rolesService.search(query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id)
  }
}
