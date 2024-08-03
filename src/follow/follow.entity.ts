import { Field, ObjectType } from '@nestjs/graphql';
import {
  Index,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
@ObjectType()
@Index(['authorId', 'userId'], { unique: true })
export class Follow {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  authorId: number;

  @Field()
  @Column()
  userId: number;

  @Field()
  @Column({ default: false })
  isConfirmed: boolean;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (author) => author.id, { onDelete: 'CASCADE' })
  author: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}
