import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { DeletedCouponService } from './deletedcoupon.service';
import { DeletedCoupon } from './entities/deletedcoupon.entity';

@Resolver()
export class DeletedCouponResolver {
  constructor(private readonly deletedCouponService: DeletedCouponService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [DeletedCoupon])
  fetchDeletedCoupon(@Context() context: IContext) {
    return this.deletedCouponService.findCoupon({ context });
  }
}
