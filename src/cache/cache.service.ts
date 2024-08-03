import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';
import { ICacheService } from './interfaces/cache-service.interface';

@Injectable()
export class RedisCacheService implements ICacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly redisCache: Cache<RedisStore>,
  ) {}

  public async get<T>(key: string): Promise<T | undefined> {
    return this.redisCache.get<T>(key);
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.redisCache.set(key, value, ttl);
  }

  public async delete(key: string): Promise<any> {
    return this.redisCache.del(key);
  }
}
