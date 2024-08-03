import { DomainError } from '../common/domain.error';

export class PostError extends DomainError {
  constructor(name: string, message: string) {
    super(name, message);
  }

  public static PhotoUploadFailed(): PostError {
    return new PostError('PhotoUploadFailed', 'Photo upload failed');
  }

  public static PostNotFound(): PostError {
    return new PostError('PostNotFound', 'The specified post was not found');
  }
}
