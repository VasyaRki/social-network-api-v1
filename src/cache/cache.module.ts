import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheServiceProvider } from './providers/cache-service.provider';

@Module({
  exports: [CacheServiceProvider],
  providers: [CacheServiceProvider],
  imports: [
    CacheManagerModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        socket: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
        },
        password: configService.getOrThrow<string>('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheModule {}
