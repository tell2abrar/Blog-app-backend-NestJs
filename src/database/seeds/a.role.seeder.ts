import { Role } from '../../users/roles/entities/role.entity';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RoleNameEnum } from '../../users/roles/constants.enum';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roles = [{ name: RoleNameEnum.SUPER_ADMIN }, { name: RoleNameEnum.ADMIN }, { name: RoleNameEnum.DEV }, { name: RoleNameEnum.CUSTOMER }];

    const roleRepository = dataSource.getRepository(Role);

    console.log('------------------------------------------');
    console.log(roles);
    console.log('------------------------------------------');
    await roleRepository.insert(roles);
    console.log('------------>Roles Updated<---------------');
  }
}
