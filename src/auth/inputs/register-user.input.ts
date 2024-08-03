import { InputType, Field } from '@nestjs/graphql';
import { IRegisterUser } from '../interfaces/register-user.interface';

@InputType()
export class UserRegistrationInput implements IRegisterUser {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
