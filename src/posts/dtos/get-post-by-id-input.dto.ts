import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class GetMyPostByIdInput {
  @Field()
  @IsNotEmpty()
  postId: string;
}
