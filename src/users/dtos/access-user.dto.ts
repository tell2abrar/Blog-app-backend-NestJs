import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessUserPayload {
  @Field({ nullable: true })
  accessToken?: string;
}
