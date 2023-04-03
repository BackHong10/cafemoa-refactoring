import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { DeletedCoupon } from '../deletedcoupon/entities/deletedcoupon.entity';
import { CouponService } from './coupon.service';
import { Coupon } from './entities/coupon.entity';

@Resolver()
export class CouponResolver {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Coupon])
  fetchUserCoupons(
    @Context() context: IContext,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    return this.couponService.findUserCoupon({
      userId: context.req.user.id,
      page,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => DeletedCoupon)
  useCoupon(
    @Args('couponId') couponId: string,
    @Args('password') password: string,
  ) {
    return this.couponService.useCoupon({ couponId, password });
  }
}
