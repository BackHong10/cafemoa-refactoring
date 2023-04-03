import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeletedCoupon } from './entities/deletedcoupon.entity';

@Injectable()
export class DeletedCouponService {
  constructor(
    @InjectRepository(DeletedCoupon)
    private readonly deletedCouponRepository: Repository<DeletedCoupon>,
  ) {}

  async findCoupon({ context }) {
    return await this.deletedCouponRepository.find({
      where: { user: { id: context.req.user.id } },
      relations: ['user', 'cafeInform', 'cafeInform.owner'],
    });
  }
}
