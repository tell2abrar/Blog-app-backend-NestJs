import { ObjectType } from '@nestjs/graphql';
import { GetMyPostsOutput } from './get-my-posts-output.dto';

@ObjectType()
export class GetPublicPostsOutput extends GetMyPostsOutput {}
