import PaginationOutput from '../../pagination/dto/pagination-output.dto';
import { Post } from '../entities/posts.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetMyPostsOutput {
  @Field(() => [Post], { nullable: 'itemsAndList' })
  posts: Post[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}
