import { DomainError } from '../common/domain.error';

export class GroupChatError extends DomainError {
  constructor(name: string, message: string) {
    super(name, message);
  }

  public static NoAccessToChat(): GroupChatError {
    return new GroupChatError('NoAccessToChat', 'No access to chat');
  }

  public static NoAccessToModifyChat(): GroupChatError {
    return new GroupChatError(
      'NoAccessToModifyChat',
      'No access to modify chat',
    );
  }
}
