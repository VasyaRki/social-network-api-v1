import { ChatRoleEnum } from '../enums/chat-role.enum';

export interface IEditChatUserRole {
  readonly userId: number;
  readonly role: ChatRoleEnum;
  readonly groupChatId: number;
  readonly currentUserId: number;
}
