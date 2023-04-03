import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OwnerUpdateInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => Boolean, { nullable: true })
  is_main: boolean;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  ownerPassword: string;

  @Field(() => String, { nullable: true })
  ownerNum: string;

  @Field(() => String, { nullable: true })
  brandName: string;
}
