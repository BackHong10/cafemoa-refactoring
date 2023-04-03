import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class createCommentInput {
  @Field(() => String)
  reply: string;

  @Field(() => [String], { nullable: true })
  image_Url: string;
}
