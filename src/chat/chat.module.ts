import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ChatService } from './chat.service';
import { JwtModule } from '../jwt/jwt.module';
import { ChatResolver } from './chat.resolver';

@Module({
  exports: [ChatResolver, ChatService],
  providers: [ChatService, ChatResolver],
  imports: [TypeOrmModule.forFeature([Message]), JwtModule],
})
export class ChatModule {}
