import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConfirmEmailInput {
  @Field(() => String)
  confirmationHash: string;
}
