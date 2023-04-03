import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { EventListenerTypes } from 'typeorm/metadata/types/EventListenerTypes';
import { PickList } from './entities/pickList.entity';

@Injectable()
export class PickListService {
  constructor(
    @InjectRepository(PickList)
    private readonly pickListRepository: Repository<PickList>,
  ) {}

  async find({ userID, page, Location }) {
    if (Location) {
      const result = await this.pickListRepository.find({
        relations: [
          'user',
          'cafeInform',
          'cafeInform.cafeTag',
          'cafeInform.owner',
          'cafeInform.cafeImage',
        ],
        where: {
          user: { id: userID },
          cafeInform: { cafeAddr: Like(`%${Location}%`) },
        },
        take: 10,
        skip: page === undefined ? 1 : (page - 1) * 10,
      });

      return result;
    } else {
      const result = await this.pickListRepository.find({
        take: 10,
        skip: page === undefined ? 1 : (page - 1) * 10,
        where: { user: { id: userID } },
        relations: [
          'user',
          'cafeInform',
          'cafeInform.cafeTag',
          'cafeInform.owner',
          'cafeInform.cafeImage',
        ],
      });
      if (!result) {
        throw new ConflictException('찜한 카페가 없습니다.');
      }
      return result;
    }
  }
}
