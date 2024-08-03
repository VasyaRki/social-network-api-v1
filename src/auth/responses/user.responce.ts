import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserResponce {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;
}
