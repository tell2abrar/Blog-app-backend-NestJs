import PaginationInput from '../../pagination/dto/pagination-input.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class GetMyPostsInput {
  @Field(() => String, { nullable: true })
  from?: string;

  @Field(() => String, { nullable: true })
  to?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => PaginationInput)
  paginationOptions: PaginationInput;
}
