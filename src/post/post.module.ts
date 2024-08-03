import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { JwtModule } from '../jwt/jwt.module';
import { TagModule } from '../tag/tag.module';
import { FollowModule } from '../follow/follow.module';
import { FileModule } from '../common/file/file.module';
import { BlockingModule } from '../blocking/blocking.module';
import { CheckAccessModule } from '../common/check-access/check-access.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    JwtModule,
    TagModule,
    FileModule,
    FollowModule,
    BlockingModule,
    CheckAccessModule,
  ],
  providers: [PostService, PostResolver],
  exports: [PostResolver, PostService],
})
export class PostModule {}
