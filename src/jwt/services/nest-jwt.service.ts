import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtError } from '../errors/invalid-jwt.error';
import { IJwtPair } from '../interfaces/jwt-pair.interface';
import { JwtService } from '../interfaces/jwt-service.interface';
import { JwtOptionsFactory } from '../factories/jwt-options.factory';

@Injectable()
export class NestJwtServiceImpl implements JwtService {
  constructor(private jwtService: NestJwtService) {}

  public generate(payload: object, type: JwtTypes): string {
    const options = JwtOptionsFactory.getInstance(type);
    const token = this.jwtService.sign(payload, {
      expiresIn: options.ttl,
      secret: options.secret,
    });

    return token;
  }

  public verify<T extends object>(token: string, type: JwtTypes): T {
    try {
      const options = JwtOptionsFactory.getInstance(type);
      const payload: T = this.jwtService.verify<T>(token, {
        secret: options.secret,
      });

      return payload;
    } catch (err) {
      throw JwtError.InvalidJwtError();
    }
  }

  public generatePair(payload: object): IJwtPair {
    const pair: IJwtPair = {
      accessToken: this.generate(payload, JwtTypes.Access),
      refreshToken: this.generate(payload, JwtTypes.Refresh),
    };

    return pair;
  }
}
