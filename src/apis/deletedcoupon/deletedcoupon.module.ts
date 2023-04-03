import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from '../coupon/entities/coupon.entity';
import { DeletedCouponResolver } from './deletedcoupon.resolver';
import { DeletedCouponService } from './deletedcoupon.service';
import { DeletedCoupon } from './entities/deletedcoupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, DeletedCoupon])],
  providers: [DeletedCouponResolver, DeletedCouponService],
})
export class DeletedCouponModule {}
