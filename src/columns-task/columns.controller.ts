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
import { ColumnsService } from './columns.service'
import { CreateColumnTaskDto } from './dto/create-column.dto'
import { UpdateColumnTaskDto } from './dto/update-column.dto'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post('project/:projectId')
  create(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Body() createColumnDto: CreateColumnTaskDto,
  ) {
    return this.columnsService.create(projectId, createColumnDto)
  }

  @Get('project/:projectId')
  findByProject(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Query('withTasks') withTasks: boolean = false,
  ) {
    return this.columnsService.findByProject(projectId, withTasks)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateColumnDto: UpdateColumnTaskDto,
  ) {
    return this.columnsService.update(id, updateColumnDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.columnsService.remove(id)
  }

  @Put('project/:projectId/reorder')
  reorder(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Body() columnOrders: { id: string; order: number }[],
  ) {
    return this.columnsService.reorder(projectId, columnOrders)
  }
}
