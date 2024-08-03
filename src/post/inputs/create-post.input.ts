import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => GraphQLUpload, { nullable: true })
  photo?: FileUpload;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
