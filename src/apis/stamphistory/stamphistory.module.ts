import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from '../coupon/entities/coupon.entity';
import { Owner } from '../owner/entities/owner.entity';
import { Stamp } from '../stamp/entities/stamp.entity';
import { StampHistory } from './entities/stamphistory.entity';
import { StampHistoryResolver } from './stamphistory.resolver';
import { StampHistoryService } from './stamphistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([StampHistory, Stamp, Owner, Coupon])],
  providers: [StampHistoryResolver, StampHistoryService],
})
export class StampHistoryModule {}
