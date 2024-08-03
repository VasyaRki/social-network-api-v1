import { UseGuards } from '@nestjs/common';
import {
  Args,
  Query,
  Context,
  Resolver,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { GroupChat } from './group-chats.entity';
import { Message } from '../chat/message.entity';
import { GroupChatService } from './group-chats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InviteToChatInput } from './inputs/invite-to-chat.input';
import { UserChatMembership } from './user-chat-membership.entity';
import { EditGroupChatInput } from './inputs/edit-group-chat.input';
import { RemoveFromChatInput } from './inputs/remove-from-chat.input';
import { IJwtPayload } from '../jwt/interfaces/jwt-payload.interface';
import { EditChatUserRoleInput } from './inputs/edit-chat-user-role.input';
import { SendMessageToChatInput } from './inputs/send-message-to-chat.input';
import { IJwtPayloadDecorator } from '../jwt/decorators/jwt-payload.decorator';

const pubSub = new PubSub();

@Resolver()
export class GroupChatResolver {
  constructor(private readonly groupChatService: GroupChatService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserChatMembership])
  async chatListUsers(
    @Args('chatgroupChatIdId') groupChatId: number,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<UserChatMembership[]> {
    return this.groupChatService.chatListUsers(groupChatId, payload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  async getChatHistory(
    @Args('groupChatId') groupChatId: number,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<Message[]> {
    return this.groupChatService.getChatHistory(groupChatId, payload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GroupChat)
  async createGroupChat(
    @Args('name') name: string,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<GroupChat> {
    return this.groupChatService.createGroupChat({
      ownerId: payload.id,
      name,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GroupChat)
  async editGroupChat(
    @Args('input') input: EditGroupChatInput,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<GroupChat> {
    return this.groupChatService.editGroupChat({
      ...input,
      userId: payload.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async inviteToChat(
    @Args('input') input: InviteToChatInput,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<boolean> {
    return this.groupChatService.inviteToChat({
      groupChatId: input.groupChatId,
      currentUserId: payload.id,
      inviteUserId: input.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async removeFromChat(
    @Args('input') input: RemoveFromChatInput,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<boolean> {
    return this.groupChatService.removeFromChat({
      currentUserId: payload.id,
      removeUserId: input.userId,
      groupChatId: input.groupChatId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  async sendMessageToChat(
    @Args('input') input: SendMessageToChatInput,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<Message> {
    const message = await this.groupChatService.sendMessageToChat({
      ...input,
      authorId: payload.id,
    });

    pubSub.publish('groupChatMessage' + input.groupChatId, {
      groupChatMessage: { ...message },
    });

    return message;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async editChatUserRole(
    @Args('input') input: EditChatUserRoleInput,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<boolean> {
    return this.groupChatService.editChatUserRole({
      ...input,
      currentUserId: payload.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async leaveChat(
    @Args('chatId') chatId: number,
    @IJwtPayloadDecorator() payload: IJwtPayload,
  ): Promise<boolean> {
    return this.groupChatService.leaveChat({
      groupChatId: chatId,
      userId: payload.id,
    });
  }

  @Subscription(() => Message)
  async groupChatMessage(
    @Args('groupChatId') groupChatId: number,
    @Context() context,
  ) {
    await this.groupChatService.checkChatAccess(context.id, groupChatId);
    return pubSub.asyncIterator('groupChatMessage' + groupChatId);
  }
}
