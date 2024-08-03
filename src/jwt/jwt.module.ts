import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtAccessOptions } from './factories/jwt-access.options';
import { JwtRefreshOptions } from './factories/jwt-refresh.options';
import { JwtServiceProvider } from './providers/jwt-service.provider';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtAccessOptions,
    JwtRefreshOptions,
    JwtServiceProvider,
    JwtAuthGuard,
  ],
  exports: [JwtServiceProvider, JwtAuthGuard],
})
export class JwtModule {}
