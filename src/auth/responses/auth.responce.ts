import { Field, ObjectType } from '@nestjs/graphql';
import { UserResponce } from './user.responce';

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => UserResponce)
  user: UserResponce;
}
