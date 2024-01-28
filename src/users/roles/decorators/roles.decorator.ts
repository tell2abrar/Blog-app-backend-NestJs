import { SetMetadata } from '@nestjs/common';
import { ROLES_META_DATA, RoleNameEnum } from '../constants.enum';

export const Roles = (roles: Array<RoleNameEnum>) => SetMetadata(ROLES_META_DATA.ROLES, roles);
