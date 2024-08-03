import { InputType, Field } from '@nestjs/graphql';
import { UserFilterInput } from './user-filter.input';
import { PaginationQuery } from '../../common/types/pagination-query.type';

@InputType()
export class GetUsersInput {
  @Field({ nullable: true })
  filter?: UserFilterInput;

  @Field({ nullable: true })
  paginationQuery?: PaginationQuery;
}
