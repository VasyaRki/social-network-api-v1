import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MessageDataInput {
  @Field(() => String)
  message: string;

  @Field(() => Number)
  recipientId: number;
}
