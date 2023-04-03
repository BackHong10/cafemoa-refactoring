import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOwnerCommentInput {
  @Field(() => String)
  content: string;
}
