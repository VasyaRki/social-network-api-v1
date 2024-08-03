import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserFilterInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;
}
