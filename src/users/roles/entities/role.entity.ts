import { User } from '../../entities/users.entity';
import { IsNotEmpty } from 'class-validator';
import { RoleNameEnum } from '../constants.enum';
import { AbstractEntity } from '../../../common/entities/abstractEntity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('roles')
@ObjectType()
export class Role extends AbstractEntity {
  @Field(() => RoleNameEnum)
  @Column({ type: 'enum', enum: RoleNameEnum })
  @IsNotEmpty()
  name: RoleNameEnum;

  @ManyToMany(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  users: User[];
}
