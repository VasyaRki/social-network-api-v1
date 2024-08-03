import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { JwtModule } from '../jwt/jwt.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { CheckAccessModule } from '../common/check-access/check-access.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    JwtModule,
    PostModule,
    CommentModule,
    CheckAccessModule,
  ],
  providers: [LikeService, LikeResolver],
  exports: [LikeResolver, LikeService],
})
export class LikeModule {}
