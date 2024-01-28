import { IsNotEmpty } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatePostInput {
  @Field()
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
