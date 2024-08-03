import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageToChatInput {
  @Field(() => Number)
  groupChatId: number;

  @Field(() => String)
  text: string;
}
