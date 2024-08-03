import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteOrAddLike {
  @Field(() => Boolean, { nullable: true })
  removed?: boolean;

  @Field(() => Boolean, { nullable: true })
  added?: boolean;
}
