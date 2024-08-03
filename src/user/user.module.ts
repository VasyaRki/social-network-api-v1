import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { JwtModule } from '../jwt/jwt.module';
import { FileModule } from '../common/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, FileModule],
  providers: [UserResolver, UserService],
  exports: [UserResolver, UserService],
})
export class UserModule {}
