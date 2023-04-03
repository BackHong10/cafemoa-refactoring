import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeImageResolver } from './cafeImage.resolver';
import { CafeImageService } from './cafeImage.service';
import { CafeImage } from './entities/cafeImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CafeImage])],
  providers: [CafeImageService, CafeImageResolver],
})
export class CafeImageModule {}
