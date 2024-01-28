import { Post } from '../../posts/entities/posts.entity';
import { Role } from '../roles/entities/role.entity';
import { Comment } from '../../comments/entities/comments.entity';
import { AbstractEntity } from '../../common/entities/abstractEntity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity('users')
@ObjectType()
export class User extends AbstractEntity {
  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ name: 'user_name' })
  userName: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [Role], { nullable: 'itemsAndList' })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];
}
