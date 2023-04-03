import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { DeletedCoupon } from '../deletedcoupon/entities/deletedcoupon.entity';
import { Owner } from '../owner/entities/owner.entity';
import { StampHistory } from '../stamphistory/entities/stamphistory.entity';
import { User } from '../user/entities/user.entity';
import { Stamp } from './entities/stamp.entity';
import { StampResolver } from './stamp.resolver';
import { StampService } from './stamp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Stamp, //
      User,
      CafeInform,
      Owner,
      StampHistory,
      DeletedCoupon,
      Coupon,
    ]),
  ],
  providers: [StampService, StampResolver],
})
export class StampModule {}
