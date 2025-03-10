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
  Req,
  Request,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Auth } from '@/auth/auth.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { RequestWithUser } from 'types'
import { FilterTaskDto } from './dto/filter-task.dto'
import { PERMISSIONS } from '@/permissions/constants/permissions'

@Auth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Auth(PERMISSIONS.CREATE_TASK)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: RequestWithUser) {
    return this.tasksService.create(createTaskDto, req.user)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('activity')
  getTaskActivity(
    @Query('projectId') projectId: string,
    @Query('taskId') taskId: string,
    @Query('userId') userId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.getTaskActivity(req.user, projectId, taskId, userId)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get()
  findAll(@Query() filterTaskDto: FilterTaskDto, @Request() req: RequestWithUser) {
    return this.tasksService.findAll(filterTaskDto, req.user)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('project/:projectId')
  findByProject(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.tasksService.findByProject(projectId, paginationDto)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.tasksService.findOne(id, req.user)
  }

  @Auth(PERMISSIONS.EDIT_TASK)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user)
  }

  @Auth(PERMISSIONS.DELETE_TASK)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.tasksService.remove(id, req.user)
  }

  @Auth(PERMISSIONS.EDIT_TASK)
  @Put('reorder')
  reorder(@Body() taskOrders: { id: string; order: number }[]) {
    return this.tasksService.reorder(taskOrders)
  }
}
