import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'

import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { Auth } from '@/auth/auth.decorator'

@Auth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto)
  }

  @Get('task/:taskId')
  findAllByTask(@Param('taskId', ParseMongoIdPipe) taskId: string) {
    return this.commentsService.findAllByTask(taskId)
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.commentsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.commentsService.remove(id)
  }
}
