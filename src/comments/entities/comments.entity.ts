import { Post } from '../../posts/entities/posts.entity';
import { User } from '../../users/entities/users.entity';
import { AbstractEntity } from '../../common/entities/abstractEntity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@ObjectType()
@Entity('comments')
export class Comment extends AbstractEntity {
  @Field()
  @Column()
  content: string;

  @Field()
  @Column({ name: 'reply_count' })
  replyCount: number;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'parent_id' })
  parent?: Comment;

  @OneToMany(() => Comment, (reply) => reply.parent)
  replies: Comment[];
}
