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

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { UserAuth } from '@/types'

import { PERMISSIONS } from '@/permissions/constants/permissions'
import { TasksService } from '@/tasks/tasks.service'

import { PaginationDto } from '@/common/dto/pagination.dto'
import { CreateTaskDto } from '@/tasks/dto/create-task.dto'
import { UpdateTaskDto } from '@/tasks/dto/update-task.dto'
import { FilterTaskDto } from '@/tasks/dto/filter-task.dto'
import { UpdateFieldDto } from '@/tasks/dto/update-field.dto'
import { CreateFieldDto } from '@/tasks/dto/create-field.dto'
import { SelectTaskDto } from '@/tasks/dto/select.dto'
import { FilterTaskActivityDto } from '@/tasks/dto/filter-task-activity'

@Auth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Auth(PERMISSIONS.CREATE_TASK)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @User() user: UserAuth) {
    return this.tasksService.create(createTaskDto, user)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('activity')
  getTaskActivity(
    @Query() filterTaskActivityDto: FilterTaskActivityDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.getTaskActivity(user, filterTaskActivityDto)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('activity/recent')
  getRecentTaskActivity(
    @Query() filterTaskActivityDto: FilterTaskActivityDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.getRecentTaskActivity(user, filterTaskActivityDto)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get()
  findAll(@Query() filterTaskDto: FilterTaskDto, @User() user: UserAuth) {
    return this.tasksService.findAll(filterTaskDto, user)
  }

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

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('total')
  getTotalTasks(@User() user: UserAuth) {
    return this.tasksService.getTotalTasks(user)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @User() user: UserAuth,
    @Query('fields') fields: boolean = false,
  ) {
    return this.tasksService.findOne(id, user, fields)
  }

  @Auth(PERMISSIONS.EDIT_TASK)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.update(id, updateTaskDto, user)
  }

  @Auth(PERMISSIONS.DELETE_TASK)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.tasksService.remove(id, user)
  }

  @Auth(PERMISSIONS.EDIT_TASK)
  @Put('reorder')
  reorder(@Body() taskOrders: { id: string; order: number }[]) {
    return this.tasksService.reorder(taskOrders)
  }

  @Auth(PERMISSIONS.EDIT_TASK)
  @Post(':id/field')
  createField(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() createFieldDto: CreateFieldDto,
    @User() user: UserAuth,
  ) {
    return this.tasksService.createField(id, createFieldDto, user)
  }

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
