import { ObjectType, Field } from '@nestjs/graphql';
import { Post } from '../post.entity';

@ObjectType()
export class PaginatedPostsResponce {
  @Field(() => [Post])
  data: Post[];

  @Field(() => Number)
  total: number;
}
