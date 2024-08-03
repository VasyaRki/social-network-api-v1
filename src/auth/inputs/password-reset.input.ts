import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PasswordResetInput {
  @Field(() => String)
  confirmationHash: string;

  @Field(() => String)
  password: string;
}
