import { InputType, Field } from '@nestjs/graphql';
import { ILoginUser } from '../interfaces/login-user.interface';

@InputType()
export class UserLoginInput implements ILoginUser {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
