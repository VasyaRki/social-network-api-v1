import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
@ObjectType()
export class Like {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Number)
  @Column({ nullable: true })
  authorId: number;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  postId: number;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  commentId: number;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  post: Post;

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (comment) => comment.id, { onDelete: 'CASCADE' })
  comment: Comment;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (author) => author.id, { onDelete: 'CASCADE' })
  author: User;
}
