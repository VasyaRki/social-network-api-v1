import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class InviteToChatInput {
  @Field(() => Number)
  groupChatId: number;

  @Field(() => Number)
  userId: number;
}
