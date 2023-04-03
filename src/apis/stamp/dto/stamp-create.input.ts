import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateStampInput {
  @Field(() => String)
  phone: string;

  @Field(() => String)
  cafeId: string;

  @Field(() => Int)
  count: number;

  @Field(() => String)
  password: string;
}
