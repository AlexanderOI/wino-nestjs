import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'

import { Comment, CommentSchema } from '@/models/comment.model'
import { Task, TaskSchema } from '@/models/task.model'
import { User, UserSchema } from '@/models/user.model'
import { NotificationsModule } from '@/notifications/notifications.module'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { CommentsController } from '@/comments/comments.controller'
import { CommentsService } from '@/comments/comments.service'

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, JwtService, CloudinaryService],
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
    NotificationsModule,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
