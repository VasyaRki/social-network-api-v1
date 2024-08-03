import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '../jwt/jwt.module';
import { GroupChat } from './group-chats.entity';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';
import { CacheModule } from '../cache/cache.module';
import { GroupChatService } from './group-chats.service';
import { GroupChatResolver } from './group-chats.resolver';
import { UserChatMembership } from './user-chat-membership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupChat, UserChatMembership]),
    JwtModule,
    UserModule,
    ChatModule,
    CacheModule,
  ],
  providers: [GroupChatResolver, GroupChatService],
  exports: [GroupChatService],
})
export class GroupChatModule {}
