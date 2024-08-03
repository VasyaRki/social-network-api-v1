import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemoveFromChatInput {
  @Field(() => Number)
  groupChatId: number;

  @Field(() => Number)
  userId: number;
}
