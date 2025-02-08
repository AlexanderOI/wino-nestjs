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

@Auth()
@Controller('tasks/')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: RequestWithUser) {
    return this.tasksService.create(createTaskDto, req.user)
  }

  @Get('project/:projectId')
  findAll(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.tasksService.findAll(projectId, paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.tasksService.findOne(id, req.user)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.tasksService.remove(id, req.user)
  }

  @Put('reorder')
  reorder(@Body() taskOrders: { id: string; order: number }[]) {
    return this.tasksService.reorder(taskOrders)
  }

  @Get(':id/activity')
  getTaskActivity(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tasksService.getTaskActivity(id)
  }

  @Get('project/:projectId/activity')
  getTaskActivityByProject(@Param('projectId', ParseMongoIdPipe) projectId: string) {
    return this.tasksService.getTaskActivityByProject(projectId)
  }
}
