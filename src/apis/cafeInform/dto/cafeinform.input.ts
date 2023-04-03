import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CafeInformInput {
  @Field(() => String)
  cafeinfo: string;

  @Field(() => String)
  operatingInfo: string;

  @Field(() => String)
  cafeAddr: string;

  @Field(() => String)
  notice: string;

  @Field(() => String)
  detailAddr: string;

  @Field(() => [String])
  cafeTag: string[];

  @Field(() => [String])
  menu_imageUrl: string[];

  @Field(() => [String])
  cafe_imageUrl: string[];

  @Field(() => Boolean)
  is_Parking: boolean;

  @Field(() => Boolean)
  is_WC: boolean;

  @Field(() => Boolean)
  is_Wifi: boolean;
}
