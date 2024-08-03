import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EditGroupChatInput {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  groupChatId: number;
}
