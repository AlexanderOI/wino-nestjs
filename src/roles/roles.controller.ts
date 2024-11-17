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
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard'
import { Auth } from 'src/auth/auth.decorator'
import { Permissions } from 'src/permissions/decorators/permissions.decorator'
import { ParseMongoIdPipe } from 'src/common/parse-mongo-id.pipe'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  // @UseGuards(AuthGuardJwt, PermissionsGuard)
  // @Permissions(['admin'])
  create(@Request() req: RequestWithUser, @Body() createRoleDto: CreateRoleDto) {
    const user = req.user
    return this.rolesService.create(createRoleDto, user)
  }

  @Get(':companyId')
  // @UseGuards(AuthGuardJwt, PermissionsGuard)
  // @Permissions(['admin'])
  findAll(
    @Request() req: RequestWithUser,
    @Param('companyId', ParseMongoIdPipe) companyId: string,
  ) {
    return this.rolesService.findAll(companyId)
  }

  @Get(':id')
  // use ParseMongoIdPipe to validate the id
  find(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.find(id)
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.rolesService.search(query)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.remove(id)
  }
}
