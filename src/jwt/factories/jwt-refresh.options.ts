import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtOptions } from '../interfaces/jwt-options.interface';
import { JwtOptionsFactory } from './jwt-options.factory';

@Injectable()
export class JwtRefreshOptions implements JwtOptions {
  public readonly ttl: string;
  public readonly secret: string;

  constructor(configService: ConfigService) {
    this.ttl = configService.get<string>('JWT_REFRESH_TTL');
    this.secret = configService.get<string>('JWT_REFRESH_SECRET');

    JwtOptionsFactory.register(JwtTypes.Refresh, this);
  }
}
