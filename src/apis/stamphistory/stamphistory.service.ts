import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { StampHistory } from './entities/stamphistory.entity';
import * as bcrypt from 'bcrypt';
import { Stamp } from '../stamp/entities/stamp.entity';
import { Coupon } from '../coupon/entities/coupon.entity';

@Injectable()
export class StampHistoryService {
  constructor(
    @InjectRepository(StampHistory)
    private readonly stampHistoryRepository: Repository<StampHistory>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(Stamp)
    private readonly stampRepository: Repository<Stamp>,

    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async findStamps({ ownerId, page }) {
    const cafeStamp = await this.stampHistoryRepository.find({
      where: {
        owner: { id: ownerId },
        count : MoreThan(3)
      },
      order: {
        createdAt: 'ASC',
      },
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
      relations: ['stamp', 'owner', 'user', 'stamp.cafeInform'],
    });

    return cafeStamp;
  }

  async delete({ ownerpassword, stamphistoryId }) {
    const create = new Date();
    const year = create.getFullYear();
    const month = create.getMonth() + 7;
    const day = create.getDate();

    const expiredDate = `${year}-${month}-${day}`;

    const stamphistory = await this.stampHistoryRepository.findOne({
      where: { id: stamphistoryId },
      relations: ['owner', 'stamp', 'user'],
    });

    const owner = await this.ownerRepository.findOne({
      where: {
        id: stamphistory.owner.id,
      },
    });

    const validOwnerPwd = await bcrypt.compare(
      ownerpassword,
      owner.ownerPassword,
    );
    if (!validOwnerPwd) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const stamp = await this.stampRepository.findOne({
      where: { id: stamphistory.stamp.id },
      relations: ['cafeInform'],
    });

    if (stamp.count - stamphistory.count < 0) {
      await this.stampRepository.update(
        {
          id: stamphistory.stamp.id,
        },
        {
          count: stamp.count - stamphistory.count + 10,
        },
      );
      const stamp2 = await this.stampRepository.findOne({
        where: { id: stamphistory.stamp.id },
      });
      if (stamp2.count < 0) {
        throw new UnprocessableEntityException(
          '실제로 쿠폰 사용되었습니다. 경찰에 신고하십시오',
        );
      }

      await this.stampHistoryRepository.delete({
        id: stamphistoryId,
      });

      const result = await this.couponRepository.findOne({
        where: {
          user: { id: stamphistory.user.id },
          cafeInform: { id: stamp.cafeInform.id },
          expiredDate,
        },
      });

      await this.couponRepository.delete({
        id: result.id,
      });

      return stamp2.count;
    } else {
      await this.stampRepository.update(
        {
          id: stamphistory.stamp.id,
        },
        {
          count: stamp.count - stamphistory.count,
        },
      );
      const stamp2 = await this.stampRepository.findOne({
        where: { id: stamphistory.stamp.id },
      });
      if (stamp2.count < 0) {
        throw new UnprocessableEntityException(
          '실제로 쿠폰 사용되었습니다. 경찰에 신고하십시오',
        );
      }

      await this.stampHistoryRepository.delete({
        id: stamphistoryId,
      });
      return stamp2.count;
    }
  }
}
