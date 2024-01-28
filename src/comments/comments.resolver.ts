import { Roles } from '../users/roles/decorators/roles.decorator';
import { Comment } from '../comments/entities/comments.entity';
import { AuthUser } from '../users/auth/decorators/graphql-auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../users/roles/guards/roles-guard.guard';
import { ICurrentUser } from '../users/auth/current-user.interface';
import { RoleNameEnum } from '../users/roles/constants.enum';
import { CommentsService } from './comments.service';
import { GetRepliesInput } from './dtos/get-replies-input.dto';
import { GetCommentsInput } from './dtos/get-comments-input.dto';
import { GetCommentsOutput } from './dtos/get-comments-output.dto';
import { CreateCommentInput } from './dtos/create-comment-input.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Mutation(() => Comment)
  async createComment(@AuthUser() user: ICurrentUser, @Args('input') input: CreateCommentInput): Promise<Comment> {
    return await this.commentsService.createComment(input, user);
  }

  @Query(() => GetCommentsOutput)
  async getComments(@Args('input') input: GetCommentsInput): Promise<GetCommentsOutput> {
    return await this.commentsService.getComments(input);
  }

  @Query(() => [Comment])
  async getReplies(@Args('input') input: GetRepliesInput): Promise<Array<Comment>> {
    return await this.commentsService.getReplies(input);
  }

  @Mutation(() => Boolean)
  async deleteComment(@Args('id') id: string): Promise<boolean> {
    return await this.commentsService.delete(id);
  }

  @UseGuards(RolesGuard)
  @Roles([RoleNameEnum.SUPER_ADMIN, RoleNameEnum.ADMIN, RoleNameEnum.DEV])
  @Mutation(() => Boolean)
  async forceDeleteComment(@Args('id') id: string): Promise<boolean> {
    return await this.commentsService.forceDelete(id);
  }
}
