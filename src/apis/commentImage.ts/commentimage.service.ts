import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentImage } from './entities/commentImage.entity';
import { Comment } from '../comment/entities/comment.entity';

@Injectable()
export class CommentImageService {
  constructor(
    @InjectRepository(CommentImage)
    private readonly CommentImageRepository: Repository<CommentImage>,
    @InjectRepository(Comment)
    private readonly CommentRepository: Repository<Comment>,
  ) {}
  async findAll() {
    return await this.CommentImageRepository.find({
      relations: ['comment'],
    });
  }
  async findOne({ commentId }) {
    const result = await this.CommentImageRepository.findOne({
      where: { comment: { id: commentId } },
      relations: ['comment'],
    });
    return result;
  }

  async find({ commentId }) {
    const result = await this.CommentImageRepository.find({
      where: { comment: { id: commentId } },
      relations: ['comment'],
    });
    return result;
  }

  async delete({ context, commnetImageID }) {
    const result = await this.CommentImageRepository.findOne({
      where: {
        id: commnetImageID,
      },
      relations: ['comment', 'comment.user'],
    });
    if (result.comment.user.id !== context.req.user.id) {
      throw new ConflictException('이미지를 삭제할 수 없습니다.');
    }
    const resultD = await this.CommentImageRepository.softDelete({
      id: commnetImageID,
    });
    return resultD.affected ? '삭제 성공' : '삭제 실패';
  }
}
