import { Field, InputType, Int } from '@nestjs/graphql';
import { ChatRoleEnum } from '../enums/chat-role.enum';

@InputType()
export class EditChatUserRoleInput {
  @Field(() => Int)
  readonly userId: number;

  @Field(() => ChatRoleEnum)
  readonly role: ChatRoleEnum;

  @Field(() => Int)
  readonly groupChatId: number;
}
