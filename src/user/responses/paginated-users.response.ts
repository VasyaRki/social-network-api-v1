import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user.entity';

@ObjectType()
export class PaginatedUsersResponce {
  @Field(() => [User])
  data: User[];

  @Field(() => Number)
  total: number;
}
