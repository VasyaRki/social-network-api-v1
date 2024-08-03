import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  avatar?: FileUpload;

  @Field(() => Boolean, { nullable: true })
  isAccountPrivate?: boolean;
}
