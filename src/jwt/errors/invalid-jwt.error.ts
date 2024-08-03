import { DomainError } from '../../common/domain.error';

export class JwtError extends DomainError {
  constructor(name: string, message: string) {
    super(name, message);
  }

  public static InvalidJwtError(): JwtError {
    return new JwtError('InvalidJwtError', 'Invalid Jwt Error');
  }
}
