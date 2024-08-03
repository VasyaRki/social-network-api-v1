import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Message {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  text: string;

  @Field(() => Number)
  @Column()
  authorId: number;

  @Field(() => Number)
  @Column({ nullable: true })
  userId: number;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  chatId: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
