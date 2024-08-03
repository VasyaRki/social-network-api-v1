import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { MailModule } from '../mailer/mail.module';
import { CacheModule } from '../cache/cache.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UserModule, JwtModule, MailModule, CacheModule],
  providers: [AuthResolver, AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
