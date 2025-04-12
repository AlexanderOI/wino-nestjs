import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'

import { UserAuth } from '@/types'

import { CreateFormsTaskDto } from '@/forms-task/dto/create-forms-task.dto'
import { UpdateFormsTaskDto } from '@/forms-task/dto/update-forms-task.dto'
import { FormsTaskService } from '@/forms-task/forms-task.service'

@Auth()
@Controller('forms-task')
export class FormsTaskController {
  constructor(private readonly formsTaskService: FormsTaskService) {}

  @Post()
  create(@Body() createFormsTaskDto: CreateFormsTaskDto, @User() user: UserAuth) {
    return this.formsTaskService.create(createFormsTaskDto, user)
  }

  @Get()
  findAll(@User() user: UserAuth, @Query('fields') fields: boolean) {
    return this.formsTaskService.findAll(user, fields)
  }

  @Get(':id')
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @User() user: UserAuth,
    @Query('fields') fields: boolean,
  ) {
    return this.formsTaskService.findOne(id, user, fields)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateFormsTaskDto: UpdateFormsTaskDto,
    @User() user: UserAuth,
  ) {
    return this.formsTaskService.update(id, updateFormsTaskDto, user)
  }

  @Post(':id/duplicate')
  duplicate(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.formsTaskService.duplicate(id, user)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.formsTaskService.remove(id, user)
  }

  @Patch(':id/assign-form-task')
  assignFormTaskToProject(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body('projectId', ParseMongoIdPipe) projectId: string,
    @User() user: UserAuth,
  ) {
    return this.formsTaskService.assignFormTaskToProject(id, projectId, user)
  }
}
