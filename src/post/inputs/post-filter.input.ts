import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PostFilterInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Number, { nullable: true })
  userId?: number;
}
