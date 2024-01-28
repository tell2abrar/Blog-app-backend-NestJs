import { AuthGuard } from '@nestjs/passport';
import { AUTH_ERROR, META_DATA } from '../constants.enum';
import { Reflector } from '@nestjs/core';
import { ICurrentUser } from '../current-user.interface';
import { UsersService } from '../../users.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector, private readonly userService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(META_DATA.IS_PUBLIC, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.req.headers.authorization) {
      throw new UnauthorizedException(AUTH_ERROR.NO_TOKEN_PROVIDED);
    }

    ctx.user = await this.validateToken(ctx.req.headers.authorization);
    return true;
  }

  async validateToken(authorizationBearer: string): Promise<ICurrentUser> {
    if (authorizationBearer.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException(AUTH_ERROR.NO_TOKEN_PROVIDED);
    }
    const token = authorizationBearer.split(' ')[1];
    try {
      return await this.userService.verifyJwt(token);
    } catch (exception) {
      if (
        exception instanceof UnauthorizedException ||
        (exception.name === AUTH_ERROR.JSON_WEB_TOKEN_ERROR && exception.message === AUTH_ERROR.INVALID_SIGNATURE) ||
        (exception.name === AUTH_ERROR.TOKEN_EXPIRED_ERROR && exception.message === AUTH_ERROR.JWT_EXPIRED)
      ) {
        throw new UnauthorizedException(AUTH_ERROR.EXPIRED_OR_INVALID);
      }

      throw exception;
    }
  }
}
