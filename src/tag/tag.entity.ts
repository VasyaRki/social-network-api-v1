import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../post/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
@ObjectType()
export class Tag {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Post])
  @ManyToMany(() => Post, (post) => post.tags)
  @JoinTable()
  posts: Post[];
}
