import { Comment } from './entities/comments.entity';
import { ICurrentUser } from '../users/auth/current-user.interface';
import { COMMENTS_ERROR } from './constants.enum';
import { GetRepliesInput } from './dtos/get-replies-input.dto';
import { GetCommentsInput } from './dtos/get-comments-input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCommentsOutput } from './dtos/get-comments-output.dto';
import { CreateCommentInput } from './dtos/create-comment-input.dto';
import { IsNull, Repository } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {}

  async createComment(input: CreateCommentInput, user: ICurrentUser): Promise<Comment> {
    try {
      const { postId, parentId, ...rest } = input;
      const { userId } = user;

      const comment = await this.commentRepository.save({
        ...rest,
        post: { id: postId },
        user: { id: userId },
        parent: { id: parentId },
        replyCount: 0,
      });

      if (parentId) {
        const parentComment = await this.commentRepository.findOne({ where: { id: parentId } });
        const replyCountOfParentComment = parentComment.replyCount;
        await this.commentRepository.save({ ...parentComment, replyCount: replyCountOfParentComment + 1 });
      }

      return comment;
    } catch (exception) {
      throw new InternalServerErrorException(exception);
    }
  }

  async getComments(input: GetCommentsInput): Promise<GetCommentsOutput> {
    try {
      const {
        postId,
        paginationOptions: { limit, page },
      } = input;
      const skip = (page - 1) * limit;

      const commentsQuery = this.commentRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.user', 'u')
        .andWhere('c.user_id = u.id ')
        .andWhere('c.post_id =:postId', { postId });
      commentsQuery.andWhere('c.parent_id IS NULL');
      commentsQuery.andWhere('c.deletedAt IS NULL');

      commentsQuery.skip(skip).orderBy('c.createdAt', 'ASC').take(limit);
      const [comments, count] = await commentsQuery.getManyAndCount();
      const totalPages = Math.ceil(count / limit);

      const paginationResponse = {
        data: comments,
        ...input.paginationOptions,
        totalCount: count,
        totalPages,
      };

      return { pagination: { ...paginationResponse }, comments: paginationResponse?.data };
    } catch (exception) {
      throw new InternalServerErrorException(exception);
    }
  }

  async getReplies(input: GetRepliesInput): Promise<Array<Comment>> {
    try {
      const { commentId } = input;
      const replies = await this.commentRepository.find({ where: { parent: { id: commentId }, deletedAt: IsNull() }, relations: { user: true } });
      if (!replies) {
        throw new NotFoundException(COMMENTS_ERROR.REPLIES_NOT_FOUND);
      }

      return replies;
    } catch (exception) {
      if (exception instanceof NotFoundException) throw exception;
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.commentRepository.softDelete(id);
      return true;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async forceDelete(id: string): Promise<boolean> {
    try {
      const comment = await this.commentRepository.findOne({ where: { id } });
      if (!comment) throw new BadRequestException(COMMENTS_ERROR.COMMENT_NOT_FOUND);

      await this.commentRepository.delete(comment.id);
      return true;
    } catch (exception) {
      if (exception instanceof BadRequestException) throw exception;
      throw new InternalServerErrorException();
    }
  }
}
