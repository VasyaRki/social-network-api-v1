import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { EntityService } from '../common/entity.service';
import { ChatWithUserInput } from './inputs/chat-with-user.input';

@Injectable()
export class ChatService extends EntityService<Message> {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {
    super(messageRepository);
  }

  public async getChatHistoryByUserId(
    chatWithUserInput: ChatWithUserInput,
  ): Promise<Message[]> {
    return this.getMany([
      {
        userId: chatWithUserInput.userId,
        authorId: chatWithUserInput.authorId,
      },
      {
        userId: chatWithUserInput.authorId,
        authorId: chatWithUserInput.userId,
      },
    ]);
  }

  public async getGroupChatHistory(chatId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: {
        chatId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
