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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'

import { UserAuth } from '@/types'
import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { ApiErrors } from '@/common/decorators/api-errors.decorator'
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddProjectUsersDto,
} from '@/projects/dto/request'

import {
  CreateProjectResponseDto,
  UpdateProjectResponseDto,
  ProjectWithMembersResponseDto,
  ProjectListResponseDto,
  DeleteProjectResponseDto,
  SetProjectUsersResponseDto,
} from '@/projects/dto/response'
import { ProjectsService } from '@/projects/projects.service'

@ApiTags('Projects')
@ApiBearerAuth()
@Auth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary: 'Create a new project',
    description:
      'Creates a new project with the provided information. Default columns will be automatically created for the project.',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    type: CreateProjectResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.CREATE_PROJECT)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @User() user: UserAuth) {
    return this.projectsService.create(createProjectDto, user)
  }

  @ApiOperation({
    summary: 'Get all projects',
    description:
      'Retrieves all projects for the authenticated user company, including members and leader information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
    type: [ProjectWithMembersResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.projectsService.findAll(user)
  }

  @ApiOperation({
    summary: 'Get project by ID',
    description:
      'Retrieves a specific project by its ID. Optionally includes detailed member information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project retrieved successfully',
    type: ProjectWithMembersResponseDto,
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the project to retrieve',
    type: 'string',
  })
  @ApiQuery({
    name: 'withMembers',
    description: 'Whether to include detailed member information',
    type: 'boolean',
    required: false,
  })
  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('withMembers') withMembers: boolean = false,
    @User() user: UserAuth,
  ) {
    return this.projectsService.findOne(id, user, withMembers)
  }

  @ApiOperation({
    summary: 'Update a project',
    description:
      'Updates an existing project with the provided information. If the leader is changed, a notification will be sent to the new leader.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    type: UpdateProjectResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the project to update',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_PROJECT)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @User() user: UserAuth,
  ) {
    return this.projectsService.update(id, updateProjectDto, user)
  }

  @ApiOperation({
    summary: 'Delete a project',
    description:
      'Deletes a project and all its associated columns and tasks. Notifications will be sent to all project members.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    type: DeleteProjectResponseDto,
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the project to delete',
    type: 'string',
  })
  @Auth(PERMISSIONS.DELETE_PROJECT)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.projectsService.remove(id)
  }

  @ApiOperation({
    summary: 'Set project team members',
    description:
      'Updates the list of project team members. Notifications will be sent to added and removed members.',
  })
  @ApiResponse({
    status: 200,
    description: 'Project team updated successfully',
    type: SetProjectUsersResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the project to update team members',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_PROJECT)
  @Put(':id/set-users-team')
  setProjectUsers(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() addProjectUsersDto: AddProjectUsersDto,
  ) {
    return this.projectsService.setProjectUsers(id, addProjectUsersDto)
  }

  @ApiOperation({
    summary: 'Get projects by company',
    description:
      'Retrieves all projects for a specific company. The authenticated user must be a member of the company.',
  })
  @ApiResponse({
    status: 200,
    description: 'Company projects retrieved successfully',
    type: [CreateProjectResponseDto],
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'companyId',
    description: 'The ID of the company to get projects from',
    type: 'string',
  })
  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get('company/:companyId')
  getProjectsByCompanyId(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.projectsService.getProjectsByCompanyId(companyId, user)
  }
}
