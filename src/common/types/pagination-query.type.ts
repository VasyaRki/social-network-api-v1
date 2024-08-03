import { Field, InputType } from '@nestjs/graphql';

export type PagedResult<Entity> = { data: Entity[]; total: number };

@InputType()
export class PaginationQuery {
  @Field(() => Number, { nullable: true })
  page?: number;

  @Field(() => Number, { nullable: true })
  limit?: number;

  @Field(() => [String], { nullable: true })
  fields?: string[];

  @Field(() => String, { nullable: true })
  search?: string;
}
