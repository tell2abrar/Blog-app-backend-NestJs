import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetRepliesInput {
  @Field()
  @IsNotEmpty()
  commentId: string;
}
