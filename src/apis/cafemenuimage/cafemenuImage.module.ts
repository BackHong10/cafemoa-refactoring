import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeMenuImageResolver } from './cafemenuImage.resolver';
import { CafeMenuImageService } from './cafemenuImage.service';
import { CafeMenuImage } from './entities/cafemenuimage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CafeMenuImage])],
  providers: [CafeMenuImageResolver, CafeMenuImageService],
})
export class CafeMenuImageModule {}
