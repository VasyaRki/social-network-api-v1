import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/user.entity';
import { GroupChat } from './group-chats.entity';
import { ChatRoleEnum } from './enums/chat-role.enum';

@ObjectType()
@Entity()
export class UserChatMembership {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  userId: number;

  @Field(() => Int)
  @Column()
  groupChatId: number;

  @Field(() => ChatRoleEnum)
  @Column({ default: ChatRoleEnum.USER })
  role: ChatRoleEnum;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => GroupChat, { nullable: true })
  @ManyToOne(() => GroupChat, (groupChat) => groupChat.id, {
    onDelete: 'CASCADE',
  })
  groupChat: GroupChat;
}
