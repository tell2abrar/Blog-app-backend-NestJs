import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  content: string;

  @Field()
  @IsNotEmpty()
  tag: string;

  @Field()
  @IsNotEmpty()
  minutesToRead: number;
}
