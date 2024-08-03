import { IJwtPair } from './jwt-pair.interface';
import { JwtTypes } from '../enums/jwt-types.enum';

export interface JwtService {
  generatePair(payload): IJwtPair;

  generate(payload: object, type: JwtTypes): string;

  /**
   * Throws InvalidJwtError
   */
  verify<T extends object>(token: string, type: JwtTypes): T;
}
