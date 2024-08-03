import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CommentInput {
  @Field(() => Number)
  postId: number;

  @Field(() => String)
  text: string;
}
