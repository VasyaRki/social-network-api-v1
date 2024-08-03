import { DomainError } from '../common/domain.error';

export class UserError extends DomainError {
  constructor(name: string, message: string) {
    super(name, message);
  }

  public static UserDoesNotExist(): UserError {
    return new UserError('UserDoesNotExist', 'User does not exist');
  }

  public static AvatarUploadFailed(): UserError {
    return new UserError('AvatarUploadFailed', 'Avatar upload failed');
  }
}
