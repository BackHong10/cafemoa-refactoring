import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { DeletedCoupon } from '../deletedcoupon/entities/deletedcoupon.entity';
import { Owner } from '../owner/entities/owner.entity';
import { Stamp } from '../stamp/entities/stamp.entity';
import { User } from '../user/entities/user.entity';
import { CouponResolver } from './coupon.resolver';
import { CouponService } from './coupon.service';
import { Coupon } from './entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stamp,
      Coupon,
      CafeInform,
      DeletedCoupon,
      User,
      Owner,
    ]),
  ],
  providers: [CouponResolver, CouponService],
})
export class CouponModule {}
