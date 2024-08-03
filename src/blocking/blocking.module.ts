import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '../jwt/jwt.module';
import { BlockedUser } from './blocking.entity';
import { BlockingService } from './blocking.service';
import { BlockingResolver } from './blocking.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedUser]), JwtModule],
  providers: [BlockingService, BlockingResolver],
  exports: [BlockingService],
})
export class BlockingModule {}
