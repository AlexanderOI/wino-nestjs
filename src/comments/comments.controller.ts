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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger'
import { File, FileInterceptor } from '@nest-lab/fastify-multer'

import { multerOptions } from '@/cloudinary/config/multer.config'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { ApiErrors } from '@/common/decorators/api-errors.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { UserAuth } from '@/types'

import { CreateCommentDto, UpdateCommentDto } from '@/comments/dto/request'

import {
  CreateCommentResponseDto,
  CommentWithRepliesResponseDto,
  UpdateCommentResponseDto,
  DeleteCommentResponseDto,
  UploadImageResponseDto,
} from '@/comments/dto/response'

import { CommentsService } from '@/comments/comments.service'

@ApiTags('Comments')
@ApiBearerAuth()
@Auth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: 'Create a new comment',
    description:
      'Creates a new comment on a task. Supports rich text content with mentions and can be a reply to another comment. Notifications are sent to mentioned users.',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CreateCommentResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.CREATE_TASK)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() userAuth: UserAuth) {
    return this.commentsService.create(createCommentDto, userAuth)
  }

  @ApiOperation({
    summary: 'Get all comments for a task',
    description:
      'Retrieves all comments for a specific task with nested replies. Comments are sorted by creation date (newest first) and include user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [CommentWithRepliesResponseDto],
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'taskId',
    description: 'The ID of the task to get comments from',
    type: 'string',
  })
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get('task/:taskId')
  findAllByTask(@Param('taskId', ParseMongoIdPipe) taskId: string) {
    return this.commentsService.findAllByTask(taskId)
  }

  @ApiOperation({
    summary: 'Get comment by ID',
    description:
      "Retrieves a specific comment by its ID with user information and parent comment if it's a reply.",
  })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: CreateCommentResponseDto,
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the comment to retrieve',
    type: 'string',
  })
  @Auth(PERMISSIONS.VIEW_TASK)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.commentsService.findOne(id)
  }

  @ApiOperation({
    summary: 'Update a comment',
    description:
      'Updates the content of an existing comment. The comment will be marked as edited and notifications will be sent to newly mentioned users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: UpdateCommentResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the comment to update',
    type: 'string',
  })
  @Auth(PERMISSIONS.EDIT_TASK)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() userAuth: UserAuth,
  ) {
    return this.commentsService.update(id, updateCommentDto, userAuth)
  }

  @ApiOperation({
    summary: 'Delete a comment',
    description:
      'Permanently deletes a comment and all its nested replies. This action cannot be undone.',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
    type: DeleteCommentResponseDto,
  })
  @ApiErrors(['unauthorized', 'notFound'])
  @ApiParam({
    name: 'id',
    description: 'The ID of the comment to delete',
    type: 'string',
  })
  @Auth(PERMISSIONS.DELETE_TASK)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.commentsService.remove(id)
  }

  @ApiOperation({
    summary: 'Upload image for comment',
    description:
      'Uploads an image to Cloudinary for use in comment content. Returns the URL of the uploaded image.',
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: UploadImageResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @ApiConsumes('multipart/form-data')
  @Auth(PERMISSIONS.CREATE_TASK)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadImage(@UploadedFile() file: File) {
    return this.commentsService.uploadImage(file)
  }
}
