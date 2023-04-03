import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';
import { Repository } from 'typeorm';
import { CafeMenuImage } from './entities/cafemenuimage.entity';

@Injectable()
export class CafeMenuImageService {
  constructor(
    @InjectRepository(CafeMenuImage)
    private readonly cafeMenuImageRepository: Repository<CafeMenuImage>,
  ) {}

  find({ CafeInformID }) {
    return this.cafeMenuImageRepository.find({
      where: {
        cafeInform: {
          id: CafeInformID,
        },
      },
    });
  }

  async delete({ cafeMenuImageID, context }) {
    const resultOwner = await this.cafeMenuImageRepository.findOne({
      where: {
        id: cafeMenuImageID,
      },
      relations: ['cafeInform', 'cafeInform.owner'],
    });
    console.log(resultOwner);
    if (resultOwner.cafeInform.owner.id !== context.req.user.id) {
      throw new ConflictException('삭제 권한이 없습니다.');
    }
    const result = await this.cafeMenuImageRepository.delete({
      id: cafeMenuImageID,
    });
    return result.affected ? true : false;
  }
}
