import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLES_ERROR, RoleNameEnum } from './constants.enum';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  async findByName(name: RoleNameEnum): Promise<Role> {
    try {
      const role = await this.rolesRepository.findOne({ where: { name } });
      if (!role) throw new NotFoundException(ROLES_ERROR.ROLE_NOT_FOUND);

      return role;
    } catch (exception) {
      if (exception instanceof NotFoundException) throw exception;
      throw new InternalServerErrorException();
    }
  }
}
