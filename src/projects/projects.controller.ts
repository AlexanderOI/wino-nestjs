import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Put,
  Query,
} from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Auth } from '@/auth/auth.decorator'
import { RequestWithUser } from 'types'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { AddProjectUsersDto } from './dto/add-project.dto'
import { PERMISSIONS } from '@/permissions/constants/permissions'

@Auth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Auth(PERMISSIONS.CREATE_PROJECT)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req: RequestWithUser) {
    return this.projectsService.create(createProjectDto, req.user)
  }

  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.projectsService.findAll(req.user)
  }

  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('withMembers') withMembers: boolean = false,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.findOne(id, req.user, withMembers)
  }

  @Auth(PERMISSIONS.EDIT_PROJECT)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto)
  }

  @Auth(PERMISSIONS.DELETE_PROJECT)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.projectsService.remove(id)
  }

  @Auth(PERMISSIONS.EDIT_PROJECT)
  @Put(':id/set-users-team')
  setProjectUsers(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() addProjectUsersDto: AddProjectUsersDto,
  ) {
    return this.projectsService.setProjectUsers(id, addProjectUsersDto)
  }

  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get('company/:companyId')
  getProjectsByCompanyId(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.getProjectsByCompanyId(companyId, req.user)
  }
}
