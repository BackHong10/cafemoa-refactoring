import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeImage } from './entities/cafeImage.entity';

@Injectable()
export class CafeImageService {
  constructor(
    @InjectRepository(CafeImage)
    private readonly cafeImageRepository: Repository<CafeImage>,
  ) {}
  async find({ cafeInformID }) {
    const result = await this.cafeImageRepository.find({
      where: {
        cafeInform: { id: cafeInformID },
      },
      relations: ['cafeInform'],
    });
    return result;
  }

  async delete({ cafeImageID, context }) {
    const resultCafe = await this.cafeImageRepository.findOne({
      where: {
        id: cafeImageID,
      },
      relations: ['cafeInform', 'cafeInform.owner'],
    });
    if (resultCafe.cafeInform.owner.id !== context.req.user.id) {
      throw new ConflictException('삭제 권한이 없습니다.');
    }
    const result = await this.cafeImageRepository.delete({ id: cafeImageID });
    return result.affected ? true : false;
  }
}
