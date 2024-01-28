import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, ValidateIf } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field()
  @IsNotEmpty()
  postId: string;

  @Field({ nullable: true })
  @ValidateIf((input) => input.parentId !== undefined)
  @IsNotEmpty()
  parentId?: string;
}
