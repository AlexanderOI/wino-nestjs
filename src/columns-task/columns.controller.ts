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

import { ColumnsService } from '@/columns-task/columns.service'
import {
  CreateColumnDto,
  UpdateColumnDto,
  ReorderColumnsDto,
} from '@/columns-task/dto/request'
import {
  CreateColumnResponseDto,
  UpdateColumnResponseDto,
  ColumnListResponseDto,
  ColumnWithTasksCountResponseDto,
  DeleteColumnResponseDto,
  ReorderResponseDto,
} from '@/columns-task/dto/response'

@ApiTags('Columns')
@ApiBearerAuth()
@Controller('columns')
@Auth()
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @ApiOperation({
    summary: 'Create a new column',
    description:
      'Creates a new column in the specified project. The column will be added at the end of the existing columns.',
  })
  @ApiResponse({
    status: 201,
    description: 'Column created successfully',
    type: CreateColumnResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'projectId',
    description: 'The ID of the project where the column will be created',
    type: 'string',
  })
  @Auth(PERMISSIONS.CREATE_COLUMN)
  @Post('project/:projectId')
  create(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Body() createColumnDto: CreateColumnDto,
    @User() user: UserAuth,
  ) {
    return this.columnsService.create(projectId, createColumnDto, user)
  }

  @ApiOperation({
    summary: 'Create a column at specific position',
    description:
      'Creates a new column at a specific position in the project. If insertAfterColumnId is provided, the column will be inserted after that column.',
  })
  @ApiResponse({
    status: 201,
    description: 'Column created successfully at position',
    type: CreateColumnResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'projectId',
    description: 'The ID of the project where the column will be created',
    type: 'string',
  })
  @ApiQuery({
    name: 'insertAfterColumnId',
    description: 'The ID of the column after which the new column will be inserted',
    type: 'string',
    required: false,
  })
  @Auth(PERMISSIONS.CREATE_COLUMN)
  @Post('project/:projectId/position')
  createAtPosition(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Query('insertAfterColumnId') insertAfterColumnId?: string,
  ) {
    return this.columnsService.createAtPosition(
      projectId,
      createColumnDto,
      insertAfterColumnId || null,
    )
  }

  @ApiOperation({
    summary: 'Get total tasks per column',
    description:
      'Retrieves the total number of tasks for each column in the project or all projects of the user company.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total tasks per column retrieved successfully',
    type: [ColumnWithTasksCountResponseDto],
  })
  @ApiErrors(['unauthorized', 'badRequest'])
  @ApiQuery({
    name: 'projectId',
    description: 'The ID of the project to filter columns',
    type: 'string',
    required: false,
  })
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('project/total-tasks')
  getTotalTaskPerColumns(@User() user: UserAuth, @Query('projectId') projectId?: string) {
    return this.columnsService.getTotalTaskPerColumns(user, projectId)
  }

  @ApiOperation({
    summary: 'Get columns by project',
    description:
      'Retrieves all columns for a specific project. Optionally includes tasks within each column.',
  })
  @ApiResponse({
    status: 200,
    description: 'Columns retrieved successfully',
    type: [ColumnListResponseDto],
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'projectId',
    description: 'The ID of the project to get columns from',
    type: 'string',
  })
  @ApiQuery({
    name: 'withTasks',
    description: 'Whether to include tasks in the response',
    type: 'boolean',
    required: false,
  })
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('project/:projectId')
  findByProject(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Query('withTasks') withTasks: boolean = false,
  ) {
    return this.columnsService.findByProject(projectId, withTasks)
  }

  @ApiOperation({
    summary: 'Update a column',
    description: 'Updates an existing column. Completed columns cannot be updated.',
  })
  @ApiResponse({
    status: 200,
    description: 'Column updated successfully',
    type: UpdateColumnResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the column to update',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_COLUMN)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnsService.update(id, updateColumnDto)
  }

  @ApiOperation({
    summary: 'Delete a column',
    description:
      'Deletes a column and all its tasks. Completed columns cannot be deleted.',
  })
  @ApiResponse({
    status: 200,
    description: 'Column deleted successfully',
    type: DeleteColumnResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the column to delete',
    type: 'string',
  })
  @Auth(PERMISSIONS.DELETE_TASK)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.columnsService.remove(id)
  }

  @ApiOperation({
    summary: 'Reorder columns',
    description:
      'Reorders columns in a project. The completed column must always be at the end.',
  })
  @ApiResponse({
    status: 200,
    description: 'Columns reordered successfully',
    type: [ReorderResponseDto],
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'projectId',
    description: 'The ID of the project to reorder columns',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_COLUMN)
  @Put('project/:projectId/reorder')
  reorder(
    @Param('projectId', ParseMongoIdPipe) projectId: string,
    @Body() reorderDto: ReorderColumnsDto,
  ) {
    return this.columnsService.reorder(projectId, reorderDto.columnOrders)
  }
}
