import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DbModule } from './db/db.module';
import { TagModule } from './tag/tag.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { ChatModule } from './chat/chat.module';
import { MailModule } from './mailer/mail.module';
import { JWT_CONSTANTS } from './jwt/jwt.constants';
import { FollowModule } from './follow/follow.module';
import { JwtTypes } from './jwt/enums/jwt-types.enum';
import { FileModule } from './common/file/file.module';
import { CommentModule } from './comment/comment.module';
import { BlockingModule } from './blocking/blocking.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GroupChatModule } from './group-chat/group-chats.module';
import { JwtService } from './jwt/interfaces/jwt-service.interface';
import { IJwtPayload } from './jwt/interfaces/jwt-payload.interface';
import { CheckAccessModule } from './common/check-access/check-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [JwtModule],
      inject: [JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN],
      useFactory: async (jwtService: JwtService) => ({
        autoSchemaFile: true,
        installSubscriptionHandlers: true,
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: (connectionParam) => {
              const token = JwtAuthGuard.extractTokenFromAuthorizationHeaders(
                connectionParam.Authorization,
              );

              const payload: IJwtPayload = jwtService.verify(
                token,
                JwtTypes.Access,
              );

              return payload;
            },
          },
        },
      }),
    }),
    DbModule,
    JwtModule,
    TagModule,
    AuthModule,
    UserModule,
    PostModule,
    ChatModule,
    LikeModule,
    FileModule,
    MailModule,
    FollowModule,
    CommentModule,
    BlockingModule,
    GroupChatModule,
    CheckAccessModule,
  ],
  providers: [ConfigService, JwtModule],
})
export class AppModule {}
