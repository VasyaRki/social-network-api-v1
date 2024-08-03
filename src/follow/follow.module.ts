import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { JwtModule } from '../jwt/jwt.module';
import { FollowService } from './follow.service';
import { UserModule } from '../user/user.module';
import { FollowResolver } from './follow.resolver';
import { CheckAccessModule } from '../common/check-access/check-access.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    JwtModule,
    UserModule,
    CheckAccessModule,
  ],
  providers: [FollowResolver, FollowService],
  exports: [FollowResolver, FollowService],
})
export class FollowModule {}
