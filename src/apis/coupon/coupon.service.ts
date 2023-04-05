import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { DeletedCoupon } from '../deletedcoupon/entities/deletedcoupon.entity';
import { Owner } from '../owner/entities/owner.entity';
import { User } from '../user/entities/user.entity';
import { Coupon } from './entities/coupon.entity';
import * as bcrypt from 'bcrypt';
import { Stamp } from '../stamp/entities/stamp.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CafeInform)
    private readonly cafeInformRepository: Repository<CafeInform>,

    @InjectRepository(DeletedCoupon)
    private readonly deletedCouponRepository: Repository<DeletedCoupon>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(Stamp)
    private readonly stampRepository: Repository<Stamp>,
  ) {}

  async findUserCoupon({ userId, page }) {
    let date = new Date()
    let year = String(date.getFullYear())
    let month = String((date.getMonth()+1)).padStart(2,"0")
    let day = String(date.getDate()+3).padStart(2,"0")
    let nowDate = `${year}-${month}-${day}`

    const result = await this.couponRepository.find({
      where: {
        user: { id: userId },
        expiredDate: MoreThan(nowDate)
      },
      relations: ['user', 'cafeInform', 'cafeInform.owner'],
      take: 10,
      skip: page === undefined ? 0 : (page-1)*10
    });

    return result;
  }

  async useCoupon({ password, couponId }) {
    const coupon = await this.couponRepository.findOne({
      where: { id: couponId },
      relations: ['user', 'cafeInform', 'cafeInform.owner'],
    });

    if (!coupon) {
      throw new UnauthorizedException('일치하는 쿠폰이 없습니다.');
    }

    const cafeInform = await this.cafeInformRepository.findOne({
      where: { id: coupon.cafeInform.id },
      relations: ['owner'],
    });

    const owner = await this.ownerRepository.findOne({
      where: {
        id: cafeInform.owner.id,
      },
    });

    const validOwnerPwd = await bcrypt.compare(password, owner.password);
    if (!validOwnerPwd) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const result = await this.deletedCouponRepository.save({
      expiredDate: coupon.expiredDate,
      expired: false,
      user: { ...coupon.user },
      cafeInform: { ...coupon.cafeInform },
    });

    await this.couponRepository.delete({ id: couponId });

    return result;
  }
}
