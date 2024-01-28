import { InputType } from '@nestjs/graphql';
import GetMyPostsInput from './get-my-posts-input.dto';

@InputType()
export default class GetPublicPostsInput extends GetMyPostsInput {}
