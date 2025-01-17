import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Auth } from '@/auth/auth.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'

@Auth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto)
  }

  @Get()
  findAll(@Param('projectId', ParseMongoIdPipe) projectId: string) {
    return this.tasksService.findAll(projectId)
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tasksService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tasksService.remove(id)
  }

  @Put('reorder')
  reorder(@Body() taskOrders: { id: string; order: number }[]) {
    return this.tasksService.reorder(taskOrders)
  }
}
