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

@Auth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req: RequestWithUser) {
    return this.projectsService.create(createProjectDto, req.user)
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.projectsService.findAll(req.user)
  }

  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('withMembers') withMembers: boolean = false,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.findOne(id, req.user, withMembers)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.projectsService.remove(id)
  }

  @Put(':id/set-users-team')
  setProjectUsers(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() addProjectUsersDto: AddProjectUsersDto,
    @Request() req: RequestWithUser,
  ) {
    return this.projectsService.setProjectUsers(id, addProjectUsersDto, req.user)
  }
}
