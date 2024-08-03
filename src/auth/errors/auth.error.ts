import { DomainError } from '../../common/domain.error';

export class AuthError extends DomainError {
  constructor(name: string, message: string) {
    super(name, message);
  }

  public static AuthorizationHeadersNotProvided(): AuthError {
    return new AuthError(
      'AuthorizationHeadersNotProvided',
      'You have not provided authorization headers',
    );
  }

  public static InvalidAuthHeaders(): AuthError {
    return new AuthError(
      'InvalidAuthHeaders',
      'Authorization header has to be "Bearer ${token}"',
    );
  }

  public static PasswordsNotMatching(): AuthError {
    return new AuthError('PasswordsNotMatching', 'Passwords not matching');
  }

  public static AlreadyExists(): AuthError {
    return new AuthError('AlreadyExists', 'User already exists');
  }

  public static DoesNotExists(): AuthError {
    return new AuthError('DoesNotExists', 'User does not exists');
  }

  public static EmailNotConfirmed(): AuthError {
    return new AuthError('EmailNotConfirmed', 'Confirm your email first');
  }

  public static EmailAlreadyConfirmed(): AuthError {
    return new AuthError('EmailAlreadyConfirmed', 'Email already confirmed');
  }

  public static InvalidConfirmationCode(): AuthError {
    return new AuthError(
      'InvalidConfirmationCode',
      'Invalid confirmation code',
    );
  }

  public static MaxEmailConfirmationRequestsReached(): AuthError {
    return new AuthError(
      'MaxEmailConfirmationRequestsReached',
      'Max email confirmation requests reached',
    );
  }

  public static MaxPasswordResetRequestsReached(): AuthError {
    return new AuthError(
      'MaxPasswordResetRequestsReached',
      'Max password reset requests reached',
    );
  }
}
