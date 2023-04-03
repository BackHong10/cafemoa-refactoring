import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { Owner } from './entities/owner.entity';
import { OwnerResolver } from './owner.resolver';
import { OwnerService } from './owner.service';

@Module({
  imports: [TypeOrmModule.forFeature([CafeInform, Owner])],
  providers: [OwnerResolver, OwnerService],
})
export class OwnerModule {}
