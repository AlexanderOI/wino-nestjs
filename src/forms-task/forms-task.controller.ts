import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { ApiErrors } from '@/common/decorators/api-errors.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'

import { UserAuth } from '@/types'

import {
  CreateFormsTaskDto,
  UpdateFormsTaskDto,
  AssignFormTaskDto,
} from '@/forms-task/dto/request'

import {
  CreateFormsTaskResponseDto,
  UpdateFormsTaskResponseDto,
  FormsTaskWithProjectResponseDto,
  FormsTaskWithoutFieldsResponseDto,
  DuplicateFormsTaskResponseDto,
  DeleteFormsTaskResponseDto,
  AssignFormTaskResponseDto,
} from '@/forms-task/dto/response'

import { FormsTaskService } from '@/forms-task/forms-task.service'

@ApiTags('Forms Task')
@ApiBearerAuth()
@Auth()
@Controller('forms-task')
export class FormsTaskController {
  constructor(private readonly formsTaskService: FormsTaskService) {}

  @ApiOperation({
    summary: 'Create a new form task',
    description:
      'Creates a new form task with custom fields for task management. Each field can have different types like text, select, date, etc.',
  })
  @ApiResponse({
    status: 201,
    description: 'Form task created successfully',
    type: CreateFormsTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_PROJECT)
  @Post()
  create(@Body() createFormsTaskDto: CreateFormsTaskDto, @User() user: UserAuth) {
    return this.formsTaskService.create(createFormsTaskDto, user)
  }

  @ApiOperation({
    summary: 'Get all form tasks',
    description:
      'Retrieves all form tasks for the authenticated user company. Optionally excludes fields to get a lighter response.',
  })
  @ApiResponse({
    status: 200,
    description: 'Form tasks retrieved successfully with fields',
    type: [FormsTaskWithProjectResponseDto],
  })
  @ApiResponse({
    status: 200,
    description: 'Form tasks retrieved successfully without fields',
    type: [FormsTaskWithoutFieldsResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @ApiQuery({
    name: 'fields',
    description: 'Whether to include field definitions in the response',
    type: 'boolean',
    required: false,
    example: true,
  })
  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get()
  findAll(@User() user: UserAuth, @Query('fields') fields: boolean) {
    return this.formsTaskService.findAll(user, fields)
  }

  @ApiOperation({
    summary: 'Get form task by ID',
    description:
      'Retrieves a specific form task by its ID. Optionally excludes fields to get a lighter response.',
  })
  @ApiResponse({
    status: 200,
    description: 'Form task retrieved successfully with fields',
    type: CreateFormsTaskResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Form task retrieved successfully without fields',
    type: FormsTaskWithoutFieldsResponseDto,
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the form task to retrieve',
    type: 'string',
  })
  @ApiQuery({
    name: 'fields',
    description: 'Whether to include field definitions in the response',
    type: 'boolean',
    required: false,
    example: true,
  })
  @Auth(PERMISSIONS.VIEW_PROJECT)
  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @User() user: UserAuth,
    @Query('fields') fields: boolean,
  ) {
    return this.formsTaskService.findOne(id, user, fields)
  }

  @ApiOperation({
    summary: 'Update a form task',
    description: 'Updates an existing form task with new field definitions or name.',
  })
  @ApiResponse({
    status: 200,
    description: 'Form task updated successfully',
    type: UpdateFormsTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the form task to update',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_PROJECT)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateFormsTaskDto: UpdateFormsTaskDto,
    @User() user: UserAuth,
  ) {
    return this.formsTaskService.update(id, updateFormsTaskDto, user)
  }

  @ApiOperation({
    summary: 'Duplicate a form task',
    description:
      'Creates a copy of an existing form task with all its fields. The new form task will have "(duplicated)" appended to its name.',
  })
  @ApiResponse({
    status: 201,
    description: 'Form task duplicated successfully',
    type: DuplicateFormsTaskResponseDto,
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the form task to duplicate',
    type: 'string',
  })
  @Auth(PERMISSIONS.CREATE_PROJECT)
  @Post(':id/duplicate')
  duplicate(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.formsTaskService.duplicate(id, user)
  }

  @ApiOperation({
    summary: 'Delete a form task',
    description: 'Permanently deletes a form task. This action cannot be undone.',
  })
  @ApiResponse({
    status: 200,
    description: 'Form task deleted successfully',
    type: DeleteFormsTaskResponseDto,
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the form task to delete',
    type: 'string',
  })
  @Auth(PERMISSIONS.DELETE_PROJECT)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.formsTaskService.remove(id, user)
  }

  @ApiOperation({
    summary: 'Assign form task to project',
    description:
      'Assigns a form task to a project. If the project already has a form task, it will be replaced. Only one form task can be assigned per project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Form task assigned to project successfully',
    type: AssignFormTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the form task to assign',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_PROJECT)
  @Patch(':id/assign-form-task')
  assignFormTaskToProject(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() assignFormTaskDto: AssignFormTaskDto,
    @User() user: UserAuth,
  ) {
    return this.formsTaskService.assignFormTaskToProject(id, assignFormTaskDto, user)
  }
}
