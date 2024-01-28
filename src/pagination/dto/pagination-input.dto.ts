import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export default class PaginationInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
