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
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { UserAuth } from '@/types'
import { ApiErrors } from '@/common/decorators'

import { PERMISSIONS } from '@/permissions/constants/permissions'
import { TasksService } from '@/tasks/tasks.service'

import { PaginationDto } from '@/common/dto/pagination.dto'
import {
  CreateTaskDto,
  UpdateTaskDto,
  FilterTaskDto,
  MoveToColumnDto,
  MoveTaskPositionDto,
  CreateFieldDto,
  UpdateFieldDto,
  SelectTaskDto,
  FilterTaskActivityDto,
  ReorderTasksDto,
} from '@/tasks/dto/request'
import {
  CreateTaskResponseDto,
  UpdateTaskResponseDto,
  TaskResponseDto,
  TasksListResponseDto,
  ActivityResponseDto,
  TaskOperationResponseDto,
  ReorderTasksResponseDto,
  TotalTasksResponseDto,
} from '@/tasks/dto/response'

@ApiTags('tasks')
@ApiBearerAuth()
@Auth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task in the specified column and project',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: CreateTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_TASK)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @User() user: UserAuth) {
    return this.tasksService.create(createTaskDto, user)
  }

  @ApiOperation({
    summary: 'Create task at specific position',
    description: 'Creates a new task at a specific position within a column',
  })
  @ApiQuery({
    name: 'insertAfterTaskId',
    description: 'ID of the task after which to insert the new task',
    required: false,
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created at position successfully',
    type: CreateTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_TASK)
  @Post('position')
  createAtPosition(
    @Body() createTaskDto: CreateTaskDto,
    @User() user: UserAuth,
    @Query('insertAfterTaskId') insertAfterTaskId?: string,
  ) {
    return this.tasksService.createAtPosition(
      createTaskDto,
      user,
      insertAfterTaskId || null,
    )
  }

  @ApiOperation({
    summary: 'Move task to different column',
    description: 'Moves a task to a different column with optional position',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to move',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Task moved to column successfully',
    type: UpdateTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.EDIT_TASK)
  @Put(':id/move-to-column')
  moveTaskToColumn(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() moveData: MoveToColumnDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.moveTaskToColumn(id, moveData, user)
  }

  @ApiOperation({
    summary: 'Move task to different position',
    description: 'Changes the position of a task within the same column',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to move',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Task moved to position successfully',
    type: UpdateTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.EDIT_TASK)
  @Put(':id/move-to-position')
  moveTaskToPosition(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() moveData: MoveTaskPositionDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.moveTaskToPosition(id, moveData, user)
  }

  @ApiOperation({
    summary: 'Get task activity',
    description: 'Retrieves task activity logs with filtering options',
  })
  @ApiResponse({
    status: 200,
    description: 'Task activity retrieved successfully',
    type: [ActivityResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('activity')
  getTaskActivity(
    @Query() filterTaskActivityDto: FilterTaskActivityDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.getTaskActivity(user, filterTaskActivityDto)
  }

  @ApiOperation({
    summary: 'Get recent task activity',
    description: 'Retrieves recent task activity logs across projects',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent task activity retrieved successfully',
    type: [ActivityResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('activity/recent')
  getRecentTaskActivity(
    @Query() filterTaskActivityDto: FilterTaskActivityDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.getRecentTaskActivity(user, filterTaskActivityDto)
  }

  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Retrieves tasks with filtering, sorting, and pagination options',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: TasksListResponseDto,
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get()
  findAll(@Query() filterTaskDto: FilterTaskDto, @User() user: UserAuth) {
    return this.tasksService.findAll(filterTaskDto, user)
  }

  @ApiOperation({
    summary: 'Get tasks by project',
    description: 'Retrieves all tasks belonging to a specific project',
  })
  @ApiParam({
    name: 'projectId',
    description: 'The unique identifier of the project',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Project tasks retrieved successfully',
    type: [TaskResponseDto],
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('project/:projectId')
  findByProject(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Query() paginationDto: PaginationDto,
    @Query() select: SelectTaskDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.findByProject(projectId, user, paginationDto, select)
  }

  @ApiOperation({
    summary: 'Get total tasks count',
    description: 'Returns the total number of tasks in the company',
  })
  @ApiResponse({
    status: 200,
    description: 'Total tasks count retrieved successfully',
    type: TotalTasksResponseDto,
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('total')
  getTotalTasks(@User() user: UserAuth) {
    return this.tasksService.getTotalTasks(user)
  }

  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Retrieves a specific task by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'fields',
    description: 'Whether to include custom fields in the response',
    required: false,
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @User() user: UserAuth,
    @Query('fields') fields: boolean = false,
  ) {
    return this.tasksService.findOne(id, user, fields)
  }

  @ApiOperation({
    summary: 'Update a task',
    description: 'Updates an existing task with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to update',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: UpdateTaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.EDIT_TASK)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.update(id, updateTaskDto, user)
  }

  @ApiOperation({
    summary: 'Delete a task',
    description: 'Deletes a task by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task to delete',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    type: TaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.DELETE_TASK)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.tasksService.remove(id, user)
  }

  @ApiOperation({
    summary: 'Reorder tasks',
    description: 'Updates the order of multiple tasks in bulk',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks reordered successfully',
    type: ReorderTasksResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.EDIT_TASK)
  @Put('reorder')
  reorder(@Body() reorderData: ReorderTasksDto) {
    return this.tasksService.reorder(reorderData.taskOrders)
  }

  @ApiOperation({
    summary: 'Create task field',
    description: 'Adds a custom field to a task',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 201,
    description: 'Task field created successfully',
    type: TaskResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.EDIT_TASK)
  @Post(':id/field')
  createField(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() createFieldDto: CreateFieldDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.createField(id, createFieldDto, user)
  }

  @ApiOperation({
    summary: 'Update task field',
    description: 'Updates a custom field of a task',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'fieldId',
    description: 'The unique identifier of the field to update',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 200,
    description: 'Task field updated successfully',
    type: TaskOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.EDIT_TASK)
  @Put(':id/field/:fieldId')
  updateField(
    @Param('id', ParseMongoIdPipe) id: string,
    @Param('fieldId', ParseMongoIdPipe) fieldId: string,
    @Body() updateFieldDto: UpdateFieldDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.updateField(id, fieldId, updateFieldDto, user)
  }
}
