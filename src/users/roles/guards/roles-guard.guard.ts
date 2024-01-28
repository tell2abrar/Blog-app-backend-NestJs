import { User } from '../../entities/users.entity';
import { Reflector } from '@nestjs/core';
import { ROLES_META_DATA, RoleNameEnum } from '../constants.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const graphqlContext = GqlExecutionContext.create(context).getContext();

    const roles = this.reflector.get<Array<RoleNameEnum>>(ROLES_META_DATA.ROLES, context.getHandler());
    const rolesMap = new Map<RoleNameEnum, RoleNameEnum>();
    roles.forEach((role) => rolesMap.set(role, role));

    const { roles: userRoles } = graphqlContext.user as unknown as User;

    const pluckMatchedPermission = userRoles.find((userRole) => rolesMap.get(userRole.name));

    return pluckMatchedPermission ? true : false;
  }
}
