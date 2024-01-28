import { Role } from '../roles/entities/role.entity';

export class ICurrentUser {
  email: string;
  userId: string;
  roles?: Array<Role>;
}
