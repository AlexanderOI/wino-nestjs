import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common'

import { UserAuth } from '@/types'
import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PERMISSIONS } from '@/permissions/constants/permissions'

import { ColumnsService } from '@/columns-task/columns.service'
import { CreateColumnTaskDto } from '@/columns-task/dto/create-column.dto'
import { UpdateColumnTaskDto } from '@/columns-task/dto/update-column.dto'

@Controller('columns')
@Auth()
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Auth(PERMISSIONS.CREATE_COLUMN)
  @Post('project/:projectId')
  create(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Body() createColumnDto: CreateColumnTaskDto,
  ) {
    return this.columnsService.create(projectId, createColumnDto)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('project/total-tasks')
  getTotalTaskPerColumns(@User() user: UserAuth, @Query('projectId') projectId?: string) {
    return this.columnsService.getTotalTaskPerColumns(user, projectId)
  }

  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('project/:projectId')
  findByProject(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Query('withTasks') withTasks: boolean = false,
  ) {
    return this.columnsService.findByProject(projectId, withTasks)
  }

  @Auth(PERMISSIONS.EDIT_COLUMN)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateColumnDto: UpdateColumnTaskDto,
  ) {
    return this.columnsService.update(id, updateColumnDto)
  }

  @Auth(PERMISSIONS.DELETE_TASK)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.columnsService.remove(id)
  }

  @Auth(PERMISSIONS.EDIT_COLUMN)
  @Put('project/:projectId/reorder')
  reorder(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Body() columnOrders: { id: string; order: number }[],
  ) {
    return this.columnsService.reorder(projectId, columnOrders)
  }
}
