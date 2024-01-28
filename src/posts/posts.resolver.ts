import GetMyPostsInput from './dtos/get-my-posts-input.dto';
import GetMyPostByIdInput from './dtos/get-post-by-id-input.dto';
import GetPublicPostsInput from './dtos/get-public-posts-input.dto';
import { Post } from './entities/posts.entity';
import { Roles } from '../users/roles/decorators/roles.decorator';
import { Public } from '../users/auth/decorators/public.decorator';
import { AuthUser } from '../users/auth/decorators/graphql-auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../users/roles/guards/roles-guard.guard';
import { ICurrentUser } from '../users/auth/current-user.interface';
import { PostsService } from './posts.service';
import { RoleNameEnum } from '../users/roles/constants.enum';
import { CreatePostInput } from './dtos/create-post-input.dto';
import { GetMyPostsOutput } from './dtos/get-my-posts-output.dto';
import { GetPublicPostsOutput } from './dtos/get-public-posts-output.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation(() => Post)
  async createPost(@AuthUser() user: ICurrentUser, @Args('input') input: CreatePostInput): Promise<Post> {
    return await this.postsService.createPost(input, user);
  }

  @Query(() => GetMyPostsOutput)
  async getMyPosts(@AuthUser() user: ICurrentUser, @Args('input') input: GetMyPostsInput): Promise<GetMyPostsOutput> {
    return await this.postsService.getMyPosts(input, user);
  }

  @Public()
  @Query(() => GetPublicPostsOutput)
  async getPublicPosts(@Args('input') input: GetPublicPostsInput): Promise<GetPublicPostsOutput> {
    return await this.postsService.getPublicPosts(input);
  }

  @Query(() => Post)
  async getPostById(@Args('input') input: GetMyPostByIdInput) {
    return await this.postsService.getById(input);
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string): Promise<boolean> {
    return await this.postsService.delete(id);
  }

  @UseGuards(RolesGuard)
  @Roles([RoleNameEnum.SUPER_ADMIN, RoleNameEnum.ADMIN, RoleNameEnum.DEV])
  @Mutation(() => Boolean)
  async forceDeletePost(@Args('id') id: string): Promise<boolean> {
    return await this.postsService.forceDelete(id);
  }
}
