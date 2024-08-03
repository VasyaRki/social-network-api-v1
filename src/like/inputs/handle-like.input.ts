import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EntityType } from '../enums/entity-type.enum';

registerEnumType(EntityType, {
  name: 'EntityType',
});

@InputType()
export class LikeInput {
  @Field(() => Number)
  entityId: number;

  @Field(() => EntityType)
  type: EntityType;
}
