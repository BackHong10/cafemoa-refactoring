import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ['id', 'profileImage', 'detailAddress'],
  InputType,
) {
  @Field(() => String, { nullable: true })
  detailAddress: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  profileImage: string;
}
