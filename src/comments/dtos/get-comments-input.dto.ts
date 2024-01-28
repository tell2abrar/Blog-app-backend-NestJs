import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import PaginationInput from '../../pagination/dto/pagination-input.dto';

@InputType()
export class GetCommentsInput {
  @Field()
  @IsNotEmpty()
  postId: string;

  @Field(() => PaginationInput)
  paginationOptions: PaginationInput;
}
