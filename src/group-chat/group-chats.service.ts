import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserError } from '../user/user.errors';
import { Message } from '../chat/message.entity';
import { GroupChat } from './group-chats.entity';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';
import { GroupChatError } from './group-chats.error';
import { ChatRoleEnum } from './enums/chat-role.enum';
import { EntityService } from '../common/entity.service';
import { CACHE_CONSTANTS } from '../cache/cache.constants';
import { ILeaveChat } from './interface/leave-chat.interface';
import { UserChatMembership } from './user-chat-membership.entity';
import { IInviteToChat } from './interface/invite-to-chat.interface';
import { IEditGroupChat } from './interface/edit-group-chat.interface';
import { IRemoveFromChat } from './interface/remove-from-chat.interface';
import { ICreateGroupChat } from './interface/create-group-chat.interface';
import { ICacheService } from '../cache/interfaces/cache-service.interface';
import { IEditChatUserRole } from './interface/edit-chat-user-role.interface';
import { ISendMessageToChat } from './interface/send-message-to-chat.interface';

export class GroupChatService extends EntityService<GroupChat> {
  constructor(
    @InjectRepository(GroupChat)
    private groupChatRepository: Repository<GroupChat>,
    @InjectRepository(UserChatMembership)
    private userChatMembershipRepository: Repository<UserChatMembership>,
    @Inject(CACHE_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly cacheService: ICacheService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {
    super(groupChatRepository);
  }

  async chatListUsers(
    groupChatId: number,
    userId: number,
  ): Promise<UserChatMembership[]> {
    await this.checkChatAccess(userId, groupChatId);

    const users = await this.userChatMembershipRepository.find({
      where: { groupChatId },
      relations: ['user'],
    });

    return users;
  }

  async getChatHistory(
    groupChatId: number,
    userId: number,
  ): Promise<Message[]> {
    const chat = await this.getOne({ id: groupChatId });

    await this.checkChatAccess(userId, chat.id);

    const history = await this.chatService.getGroupChatHistory(groupChatId);

    return history;
  }

  async createGroupChat(input: ICreateGroupChat): Promise<GroupChat> {
    const user = await this.userService.getOne({ id: input.ownerId });

    const chat = await this.create(input);

    const member = await this.userChatMembershipRepository.create({
      groupChatId: chat.id,
      userId: user.id,
      role: ChatRoleEnum.OWNER,
    });
    await this.userChatMembershipRepository.save(member);

    return chat;
  }

  async editGroupChat(input: IEditGroupChat): Promise<GroupChat> {
    const { groupChatId, userId, ...payload } = input;

    const chat = await this.getOne({ id: groupChatId });

    if (chat.ownerId !== userId) {
      throw GroupChatError.NoAccessToModifyChat();
    }

    return this.groupChatRepository.save({ id: groupChatId, ...payload });
  }

  async inviteToChat({
    groupChatId,
    inviteUserId,
    currentUserId,
  }: IInviteToChat): Promise<boolean> {
    await this.checkChatAccess(currentUserId, groupChatId);

    const chat = await this.getOne({ id: groupChatId });
    const user = await this.userService.getOne({ id: inviteUserId });

    if (!user) {
      throw UserError.UserDoesNotExist();
    }

    const member = await this.userChatMembershipRepository.create({
      userId: user.id,
      groupChatId: chat.id,
    });
    await this.userChatMembershipRepository.save(member);

    return !!member;
  }

  async removeFromChat({
    groupChatId,
    removeUserId,
    currentUserId,
  }: IRemoveFromChat): Promise<boolean> {
    await this.checkChatAccess(currentUserId, groupChatId);

    const chat = await this.getOne({ id: groupChatId });

    const currentMembership = await this.userChatMembershipRepository.findOne({
      where: { userId: currentUserId, groupChatId: chat.id },
    });

    if (currentMembership.role === ChatRoleEnum.USER) {
      throw GroupChatError.NoAccessToModifyChat();
    }

    const result = await this.userChatMembershipRepository.delete({
      groupChatId: groupChatId,
      userId: removeUserId,
    });

    return !!result;
  }

  async sendMessageToChat(input: ISendMessageToChat): Promise<Message> {
    await this.checkChatAccess(input.authorId, input.groupChatId);

    return this.chatService.create(input);
  }

  async editChatUserRole({
    role,
    userId,
    groupChatId,
    currentUserId,
  }: IEditChatUserRole): Promise<boolean> {
    await this.checkChatAccess(currentUserId, groupChatId);

    const member = await this.userChatMembershipRepository.findOne({
      where: { userId, groupChatId },
    });

    const currentUser = await this.userChatMembershipRepository.findOne({
      where: { userId: currentUserId, groupChatId },
    });

    if (currentUser.role !== ChatRoleEnum.OWNER) {
      throw GroupChatError.NoAccessToModifyChat();
    }

    member.role = role;

    await this.userChatMembershipRepository.save(member);

    return true;
  }

  async leaveChat(input: ILeaveChat): Promise<boolean> {
    const member = await this.userChatMembershipRepository.findOne({
      where: input,
    });

    await this.userChatMembershipRepository.delete(input);

    if (member.role === ChatRoleEnum.OWNER) {
      const newOwner = await this.userChatMembershipRepository.findOne({
        where: { groupChatId: input.groupChatId },
      });

      newOwner.role = ChatRoleEnum.OWNER;

      await this.save({ id: input.groupChatId, ownerId: newOwner.userId });

      await this.userChatMembershipRepository.save(newOwner);
    }

    return true;
  }

  async checkChatAccess(userId: number, groupChatId: number): Promise<boolean> {
    const access = await this.userChatMembershipRepository.findOne({
      where: {
        userId,
        groupChatId,
      },
    });

    if (!access) {
      throw GroupChatError.NoAccessToChat();
    }

    return true;
  }
}
