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

@Controller('roles')
@Auth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto, req.user)
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.rolesService.findAll(req.user.companyId)
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.findOne(id)
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.rolesService.search(query)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: RequestWithUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, req.user)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.remove(id)
  }
}
