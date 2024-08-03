import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { User } from '../user/user.entity';
import { Like } from '../like/like.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
@ObjectType()
export class Post {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  photo?: string;

  @Field()
  @Column()
  authorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  author: User;

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.post, { nullable: true })
  like: Like[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  comment: Comment[];

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  tags: Tag[];
}
