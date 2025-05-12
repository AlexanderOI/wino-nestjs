import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Comment, CommentDocument } from '@/models/comment.model'
import { CreateCommentDto } from '@/comments/dto/create-comment.dto'
import { UpdateCommentDto } from '@/comments/dto/update-comment.dto'

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async create(createCommentDto: CreateCommentDto): Promise<CommentDocument> {
    const createdComment = new this.commentModel(createCommentDto)
    return createdComment.save()
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

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<CommentDocument> {
    return this.commentModel
      .findByIdAndUpdate(id, { ...updateCommentDto, isEdited: true }, { new: true })
      .populate('user', '_id name userName email avatar')
      .populate('parent')
      .exec()
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
}
