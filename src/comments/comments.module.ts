import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Comment, CommentSchema } from '@/models/comment.model'
import { Task, TaskSchema } from '@/models/task.model'
import { User, UserSchema } from '@/models/user.model'

import { CommentsController } from '@/comments/comments.controller'
import { CommentsService } from '@/comments/comments.service'
import { JwtService } from '@nestjs/jwt'
@Module({
  controllers: [CommentsController],
  providers: [CommentsService, JwtService],
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
