import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { Owner } from '../owner/entities/owner.entity';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { StampHistory } from '../stamphistory/entities/stamphistory.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { Stamp } from './entities/stamp.entity';

@Injectable()
export class StampService {
  constructor(
    @InjectRepository(Stamp)
    private readonly stampRepository: Repository<Stamp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CafeInform)
    private readonly cafeInformRepository: Repository<CafeInform>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(StampHistory)
    private readonly stampHistoryRepository: Repository<StampHistory>,

    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async find({ stampId }) {
    return await this.stampRepository.findOne({ where: { id: stampId } });
  }

  async findAll() {
    return await this.stampRepository.find();
  }

  async findUserStamp({ userId, page, location }) {
    if (location) {
      

      const result = await this.stampRepository.createQueryBuilder('stamp')
      .innerJoinAndSelect('stamp.user','user', 'user.id = :userId',{userId})
      .innerJoinAndSelect('stamp.cafeInform','cafeInform')
      .innerJoinAndSelect('stamp.cafeInform.owner','owner')
      .where('cafeInform.cafeAddr Like: location OR cafeInform.detailAddr Like :location', {location : `%${location}%`})
      .take(10)
      .skip(page === undefined ? 0 : (page-1) * 10)
      .getMany()

      return result
      
    } else {
      const result = await this.stampRepository.find({
        take: 10,
        skip: page === undefined ? 0 : (page - 1) * 10,
        where: { user: { id: userId } },
        relations: ['user', 'cafeInform', 'cafeInform.owner'],
      });
      
      return result;
    }
  }

  async findCafeStamp({ cafeId, userId }) {
    const result = await this.stampRepository.findOne({
      where: { cafeInform: { id: cafeId }, user: { id: userId } },
      relations: ['user', 'cafeInform', 'cafeInform.owner'],
    });
    if (result) {
      return [result.updatedAt];
    } else {
      return [];
    }
  }

  async createStamp({ createStampInput }) {
    const { count, phone, cafeId, password } = createStampInput;

    const create = new Date();
    const year = create.getFullYear();
    const month = create.getMonth() + 7;
    const day = create.getDate();

    const expiredDate = `${year}-${month}-${day}`;

    const user = await this.userRepository.findOne({
      where: { phone },
    });

    const cafeInform = await this.cafeInformRepository.findOne({
      where: { id: cafeId },
      relations: ['owner'],
    });

    const owner = await this.ownerRepository.findOne({
      where: { id: cafeInform.owner.id },
    });

    const validOwnerPwd = await bcrypt.compare(password, owner.password);
    if (!validOwnerPwd) {
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }

    const stamp = await this.stampRepository.findOne({
      where: { user: { phone }, cafeInform: { id: cafeId } },
      relations: ['user', 'cafeInform', 'cafeInform.owner'],
    });

    if (stamp) {
      if (stamp.count + count < 10) {
        const result = await this.stampRepository.save({
          id: stamp.id,
          count: stamp.count + count,
          user: { ...user },
          cafeInform: { ...cafeInform },
        });

        if (count >= 3) {
          await this.stampHistoryRepository.save({
            count,
            user: { ...user },
            owner: { ...owner },
            stamp: { ...result },
          });
        }
        return result;
      } else {
        const result = await this.stampRepository.save({
          id: stamp.id,
          count: stamp.count + count - 10,
          user: { ...user },
          cafeInform: { ...cafeInform },
        });
        await this.couponRepository.save({
          expiredDate,
          cafeInform: { ...result.cafeInform },
          user: { ...result.user },
        });
        if (count >= 3) {
          await this.stampHistoryRepository.save({
            count,
            user: { ...user },
            owner: { ...owner },
            stamp: { ...result },
          });
        }
        return result;
      }
    } else {
      if (count < 10) {
        const result = await this.stampRepository.save({
          count: count,
          user: { ...user },
          cafeInform: { ...cafeInform },
        });

        if (count >= 3) {
          await this.stampHistoryRepository.save({
            count,
            user: { ...user },
            owner: { ...owner },
            stamp: { ...result },
          });
        }
        return result;
      } else {
        const result = await this.stampRepository.save({
          count: count - 10,
          user: { ...user },
          cafeInform: { ...cafeInform },
        });
        await this.couponRepository.save({
          expiredDate,
          cafeInform: { ...result.cafeInform },
          user: { ...result.user },
        });
        if (count >= 3) {
          await this.stampHistoryRepository.save({
            count,
            user: { ...user },
            owner: { ...owner },
            stamp: { ...result },
          });
        }
        return result;
      }
    }
  }

  async deleteStamp({ stampId, userId }) {
    const result = await this.stampRepository.findOne({
      where: {
        id: stampId,
      },
      relations: ['user'],
    });
    if (result.user.id !== userId) {
      throw new ConflictException('자신의 스탬프 적립이 아닙니다.');
    }

    await this.stampRepository.delete({ id: stampId });
    return '삭제가 완료되었습니다.';
  }
}
