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
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RequestWithUser } from 'types'
import { Auth } from '@/auth/auth.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PERMISSIONS } from '@/permissions/constants/permissions'

@Controller('roles')
@Auth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth(PERMISSIONS.CREATE_ROLE)
  @Post()
  create(@Request() req: RequestWithUser, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto, req.user)
  }

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.rolesService.findAll(req.user.companyId)
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
    @Request() req: RequestWithUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, req.user)
  }

  @Auth(PERMISSIONS.DELETE_ROLE)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.remove(id)
  }
}
