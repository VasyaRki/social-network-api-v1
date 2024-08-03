import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Like } from '../like/like.entity';

@Entity()
@ObjectType()
export class Comment {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  authorId: number;

  @Field()
  @Column()
  postId: number;

  @Field()
  @Column()
  text: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (author) => author.id, { onDelete: 'CASCADE' })
  author: User;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  post: Post;

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.comment, { nullable: true })
  like: Like[];
}
