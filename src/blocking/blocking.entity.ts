import {
  Index,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@Entity()
@ObjectType()
@Index(['blockingUserId', 'blockedUserId'], { unique: true })
export class BlockedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Number)
  @Column()
  blockingUserId: number;

  @Field(() => Number)
  @Column()
  blockedUserId: number;

  @ManyToOne(() => User, (user) => user.id)
  blockingUser: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  blockedUser: User;
}
