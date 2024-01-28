import { User } from '../../users/entities/users.entity';
import { Comment } from '../../comments/entities/comments.entity';
import { AbstractEntity } from '../../common/entities/abstractEntity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@ObjectType()
@Entity('posts')
export class Post extends AbstractEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  tag: string;

  @Field()
  @Column({ name: 'minutes_to_read' })
  minutesToRead: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
