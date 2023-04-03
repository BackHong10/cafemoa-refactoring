import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from '../owner/entities/owner.entity';

import { OwnerAuthResolver } from './ownerAuth.resolver';
import { OwnerAuthService } from './ownerAuth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Owner]), JwtModule.register({})],
  providers: [OwnerAuthService, OwnerAuthResolver],
})
export class OwnerAuthModule {}
