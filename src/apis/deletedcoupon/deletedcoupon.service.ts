import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Coupon } from '../coupon/entities/coupon.entity';
import { DeletedCoupon } from './entities/deletedcoupon.entity';

@Injectable()
export class DeletedCouponService {
  constructor(
    @InjectRepository(DeletedCoupon)
    private readonly deletedCouponRepository: Repository<DeletedCoupon>,

    @InjectRepository(Coupon)
    private readonly CouponRepository: Repository<Coupon>,
  ) {}

  async findCoupon({ context }) {
    let date = new Date()
    let year = String(date.getFullYear())
    let month = String((date.getMonth()+1)).padStart(2,"0")
    let day = String(date.getDate()+3).padStart(2,"0")
    let nowDate = `${year}-${month}-${day}`

    const resultDeleted = await this.deletedCouponRepository.find({
      where: { user: { id: context.req.user.id } },
      relations: ['user', 'cafeInform', 'cafeInform.owner'],
    });

    const resultExpired = await this.CouponRepository.find({
      where:{
        user: {id : context.req.user.id},
        expiredDate : LessThan(nowDate)
      },
      relations: ['user', 'cafeInform', 'cafeInform.owner'],
    })

    resultDeleted.forEach((el) => {
      resultExpired.push(el)
    })

    return resultExpired


  }
}
