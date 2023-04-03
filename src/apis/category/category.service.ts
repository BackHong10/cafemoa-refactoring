import { ConflictException, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create({ category }) {
    const result = await this.categoryRepository.findOne({
      where: {
        category,
      },
    });
    console.log(result);
    if (result) {
      throw new ConflictException('이미 존재하는 카테고리입니다.');
    }

    return this.categoryRepository.save({ category });
  }

  find(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
  async delete({ categoryId }) {
    const result = await this.categoryRepository.softDelete({ id: categoryId });
    return result.affected ? true : false;
  }
}
