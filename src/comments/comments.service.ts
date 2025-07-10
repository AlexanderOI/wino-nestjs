import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { File } from '@nest-lab/fastify-multer'

import { Comment, CommentDocument } from '@/models/comment.model'
import { CreateCommentDto, UpdateCommentDto } from '@/comments/dto/request'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { NotificationsService } from '@/notifications/notifications.service'
import { JSONContentNode } from '@/common/json-content.dto'
import { extractMentionIds } from '@/common/utils/extract-mentions'
import { UserAuth } from '@/types'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userAuth: UserAuth,
  ): Promise<CommentDocument> {
    const createdComment = await this.commentModel.create(createCommentDto)

    await this.sendNotification(createCommentDto.content, createdComment, userAuth)

    return createdComment
  }

  async findAllByTask(taskId: string): Promise<any[]> {
    const comments = await this.commentModel
      .find({ taskId: taskId })
      .populate('user', '_id name userName email avatar')
      .sort({ createdAt: -1 })
      .exec()

    const rootComments = comments.filter((comment) => !comment.parentId)

    return rootComments.map((comment) => {
      const commentObj = comment.toObject()
      const replies = this.constructRepliesRecursive(comments, comment._id)

      return {
        ...commentObj,
        replies,
      }
    })
  }

  async findOne(id: string): Promise<CommentDocument> {
    return this.commentModel
      .findById(id)
      .populate('user', '_id name userName email avatar')
      .populate('parent')
      .exec()
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userAuth: UserAuth,
  ): Promise<CommentDocument> {
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, { ...updateCommentDto, isEdited: true }, { new: true })
      .populate('user', '_id name userName email avatar')
      .populate('parent')
      .exec()

    await this.sendNotification(updateCommentDto.content, updatedComment, userAuth)

    return updatedComment
  }

  async remove(id: string): Promise<CommentDocument> {
    await this.removeRepliesRecursive(id)

    return this.commentModel
      .findByIdAndDelete(id)
      .populate('user', '_id name userName email avatar')
      .exec()
  }

  private async removeRepliesRecursive(parentId: string): Promise<void> {
    const replies = await this.commentModel.find({ parentId }).exec()

    for (const reply of replies) {
      await this.removeRepliesRecursive(reply._id.toString())
    }

    await this.commentModel.deleteMany({ parentId }).exec()
  }

  constructRepliesRecursive(
    comments: CommentDocument[],
    parentId: string | Types.ObjectId | unknown,
  ) {
    const parentComments = comments.filter(
      (comment) => comment.parentId?.toString() === parentId.toString(),
    )
    return parentComments.map((comment) => {
      const commentObj = comment.toObject()
      const replies = this.constructRepliesRecursive(comments, comment._id)
      return {
        ...commentObj,
        replies,
      }
    })
  }

  async uploadImage(file: File): Promise<{ url: string }> {
    const imageUrl = await this.cloudinaryService.uploadImage(file)
    return { url: imageUrl }
  }

  private async sendNotification(
    content: JSONContentNode,
    comment: CommentDocument,
    userAuth: UserAuth,
  ) {
    const mentionIds = extractMentionIds(content)
    const filteredMentionIds = new Set(
      mentionIds.filter((id) => id.toString() !== userAuth._id.toString()),
    )

    if (mentionIds.length === 0) return

    const populatedComment = await this.commentModel
      .findById(comment._id)
      .populate('task', 'name')
      .exec()

    if (!populatedComment?.task) return
    await this.notificationsService.sendNotification({
      userIds: Array.from(filteredMentionIds),
      title: 'New mention in comment',
      description: `You have been mentioned in a comment on the task "${populatedComment.task.name}"`,
    })
  }
}
