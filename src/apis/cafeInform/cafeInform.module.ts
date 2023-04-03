import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeImage } from '../cafeImage/entities/cafeImage.entity';
import { CafeMenuImage } from '../cafemenuimage/entities/cafemenuimage.entity';
import { CafeTag } from '../cafeTag/entities/cafeTag.entity';
import { Owner } from '../owner/entities/owner.entity';
import { PickList } from '../pickList/entities/pickList.entity';
import { User } from '../user/entities/user.entity';
import { CafeInformResolver } from './cafeInform.resolver';
import { CafeInformService } from './cafeInform.service';
import { CafeInform } from './entities/cafeInform.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CafeInform,
      Owner,
      CafeMenuImage,
      CafeImage,
      CafeTag,
      PickList,
      User,
    ]),
  ],
  providers: [CafeInformResolver, CafeInformService],
})
export class CafeInformModule {}
