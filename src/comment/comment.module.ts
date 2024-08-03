import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { JwtModule } from '../jwt/jwt.module';
import { PostModule } from '../post/post.module';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CheckAccessModule } from '../common/check-access/check-access.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    JwtModule,
    PostModule,
    CheckAccessModule,
  ],
  providers: [CommentService, CommentResolver],
  exports: [CommentResolver, CommentService],
})
export class CommentModule {}
