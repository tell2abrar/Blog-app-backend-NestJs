import GetMyPostsInput from './dtos/get-my-posts-input.dto';
import GetMyPostByIdInput from './dtos/get-post-by-id-input.dto';
import GetPublicPostsInput from './dtos/get-public-posts-input.dto';
import { Post } from './entities/posts.entity';
import { POSTS_ERROR } from './constants.enum';
import { ICurrentUser } from '../users/auth/current-user.interface';
import { CreatePostInput } from './dtos/create-post-input.dto';
import { GetMyPostsOutput } from './dtos/get-my-posts-output.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPublicPostsOutput } from './dtos/get-public-posts-output.dto';
import { Brackets, ILike, Repository } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

  async createPost(input: CreatePostInput, user: ICurrentUser): Promise<Post> {
    try {
      const { userId } = user;
      const post = await this.postRepository.save({ ...input, user: { id: userId } });

      return post;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getMyPosts(input: GetMyPostsInput, user: ICurrentUser): Promise<GetMyPostsOutput> {
    try {
      const {
        keyword,
        paginationOptions: { limit, page },
      } = input;
      const skip = (page - 1) * limit;

      const { userId } = user;

      const postsQuery = this.postRepository.createQueryBuilder('p').innerJoinAndSelect('p.user', 'u').andWhere('u.id = :userId', { userId });
      postsQuery.andWhere('p.deletedAt IS NULL');

      if (keyword) {
        postsQuery.andWhere(
          new Brackets((qb) => {
            qb.where({ name: ILike(`%${keyword}%`) });
          }),
        );
      }

      postsQuery.skip(skip).orderBy('p.createdAt', 'DESC').take(limit);
      const [posts, count] = await postsQuery.getManyAndCount();
      const totalPages = Math.ceil(count / limit);

      const paginationResponse = {
        data: posts,
        ...input.paginationOptions,
        totalCount: count,
        totalPages,
      };

      return { pagination: { ...paginationResponse }, posts: paginationResponse?.data };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getPublicPosts(input: GetPublicPostsInput): Promise<GetPublicPostsOutput> {
    try {
      const {
        keyword,
        paginationOptions: { limit, page },
      } = input;
      const skip = (page - 1) * limit;

      const postsQuery = this.postRepository.createQueryBuilder('p').leftJoinAndSelect('p.user', 'u').andWhere('p.user_id = u.id ');
      postsQuery.andWhere('p.deletedAt IS NULL');

      if (keyword) {
        postsQuery.andWhere(
          new Brackets((qb) => {
            qb.where({ name: ILike(`%${keyword}%`) });
          }),
        );
      }

      postsQuery.skip(skip).orderBy('p.createdAt', 'DESC').take(limit);
      const [posts, count] = await postsQuery.getManyAndCount();
      const totalPages = Math.ceil(count / limit);

      const paginationResponse = {
        data: posts,
        ...input.paginationOptions,
        totalCount: count,
        totalPages,
      };

      return { pagination: { ...paginationResponse }, posts: paginationResponse?.data };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getById(input: GetMyPostByIdInput): Promise<Post> {
    try {
      const { postId } = input;
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) throw new NotFoundException(POSTS_ERROR.POST_NOT_FOUND);

      return post;
    } catch (exception) {
      if (exception instanceof NotFoundException) throw exception;
      throw new InternalServerErrorException();
    }
  }

  async delete(postId: string): Promise<boolean> {
    try {
      await this.postRepository.softDelete(postId);
      return true;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async forceDelete(postId: string): Promise<boolean> {
    try {
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) throw new BadRequestException('Post not found');

      await this.postRepository.delete(postId);
      return true;
    } catch (exception) {
      if (exception instanceof BadRequestException) throw exception;
      throw new InternalServerErrorException();
    }
  }
}
