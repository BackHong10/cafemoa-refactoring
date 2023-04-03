import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickList } from './entities/pickList.entity';
import { PickListResolver } from './pickList.resolver';
import { PickListService } from './pickList.service';

@Module({
  imports: [TypeOrmModule.forFeature([PickList])],
  providers: [PickListService, PickListResolver],
})
export class PickListModule {}
