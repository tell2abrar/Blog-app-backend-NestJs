import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export default class PaginationOutput {
  @Field(() => Int, { nullable: true })
  page: number;

  @Field(() => Int, { nullable: true })
  limit: number;

  @Field(() => Int, { nullable: true })
  totalCount: number;

  @Field(() => Int, { nullable: true })
  totalPages: number;
}
