import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common'

import { UserAuth } from '@/types'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'

import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PERMISSIONS } from '@/permissions/constants/permissions'

import { CreateProjectDto } from '@/projects/dto/create-project.dto'
import { AddProjectUsersDto } from '@/projects/dto/add-project.dto'
import { UpdateProjectDto } from '@/projects/dto/update-project.dto'
import { ProjectsService } from '@/projects/projects.service'

@Auth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Auth(PERMISSIONS.CREATE_PROJECT)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @User() user: UserAuth) {
    return this.projectsService.create(createProjectDto, user)
  }

  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.projectsService.findAll(user)
  }

  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('withMembers') withMembers: boolean = false,
    @User() user: UserAuth,
  ) {
    return this.projectsService.findOne(id, user, withMembers)
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
    @User() user: UserAuth,
  ) {
    return this.projectsService.getProjectsByCompanyId(companyId, user)
  }
}
