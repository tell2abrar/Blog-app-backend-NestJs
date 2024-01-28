import { User } from '../entities/users.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupUserOutput {
  @Field(() => User)
  user: User;
}
