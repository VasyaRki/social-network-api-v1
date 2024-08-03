import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RequestConfirmEmailInput {
  @Field(() => String)
  email: string;
}
