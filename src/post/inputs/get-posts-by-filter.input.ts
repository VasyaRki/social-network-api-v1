import { InputType, Field } from '@nestjs/graphql';
import { PostFilterInput } from './post-filter.input';
import { PaginationQuery } from '../../common/types/pagination-query.type';

@InputType()
export class GetPostsByFilterInput {
  @Field({ nullable: true })
  filter?: PostFilterInput;

  @Field({ nullable: true })
  paginationQuery?: PaginationQuery;
}
