import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { File, FileInterceptor } from '@nest-lab/fastify-multer'
import { multerOptions } from '@/cloudinary/config/multer.config'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { UserAuth } from '@/types'

import { CommentsService } from '@/comments/comments.service'
import { CreateCommentDto } from '@/comments/dto/create-comment.dto'
import { UpdateCommentDto } from '@/comments/dto/update-comment.dto'

@Auth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() userAuth: UserAuth) {
    return this.commentsService.create(createCommentDto, userAuth)
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
    @User() userAuth: UserAuth,
  ) {
    return this.commentsService.update(id, updateCommentDto, userAuth)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.commentsService.remove(id)
  }

  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadImage(@UploadedFile() file: File) {
    return this.commentsService.uploadImage(file)
  }
}
