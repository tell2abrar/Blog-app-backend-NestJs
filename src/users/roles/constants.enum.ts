import { registerEnumType } from '@nestjs/graphql';

export enum RoleNameEnum {
  DEV = 'DEV',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

registerEnumType(RoleNameEnum, {
  name: 'roleName',
});

export enum ROLES_ERROR {
  ROLE_NOT_FOUND = 'Role not found',
}

export enum ROLES_META_DATA {
  ROLES = 'roles',
}
