import PaginationOutput from '../../pagination/dto/pagination-output.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from '../entities/comments.entity';

@ObjectType()
export class GetCommentsOutput {
  @Field(() => [Comment], { nullable: 'itemsAndList' })
  comments: Comment[];

  @Field(() => PaginationOutput, { nullable: true })
  pagination?: PaginationOutput;
}
