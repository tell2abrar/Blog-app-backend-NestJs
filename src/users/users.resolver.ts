import { User } from './entities/users.entity';
import { Public } from './auth/decorators/public.decorator';
import { AuthUser } from './auth/decorators/graphql-auth-user.decorator';
import { ICurrentUser } from './auth/current-user.interface';
import { UsersService } from './users.service';
import { SigninUserInput } from './dtos/signin-user-input.dto';
import { SignupUserInput } from './dtos/signup-user-input.dto';
import { AccessUserPayload } from './dtos/access-user.dto';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async me(@AuthUser() user: ICurrentUser): Promise<User> {
    return await this.usersService.me(user);
  }

  @Public()
  @Mutation(() => User)
  async signupUser(@Args('input') input: SignupUserInput): Promise<User> {
    return await this.usersService.signup(input);
  }

  @Public()
  @Mutation(() => AccessUserPayload)
  async signinUser(@Args('input') input: SigninUserInput) {
    return await this.usersService.signin(input);
  }
}
