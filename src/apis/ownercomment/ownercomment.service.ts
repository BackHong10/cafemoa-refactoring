import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { OwnerComment } from './entities/ownercomment.entity';
import { Comment } from '../comment/entities/comment.entity';

@Injectable()
export class OwnerCommentService {
  constructor(
    @InjectRepository(OwnerComment)
    private readonly ownercommentRepository: Repository<OwnerComment>,
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async findAll({ page }) {
    return await this.ownercommentRepository.find({
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
      relations: ['comment', 'owner'],
    });
  }

  async findOne({ ownercommentId }) {
    const result = await this.ownercommentRepository.findOne({
      where: { id: ownercommentId },
      relations: ['comment', 'owner'],
    });

    return result;
  }

  async create({ createOwnerCommentInput, OwnerId, commentID }) {
    const owner = await this.ownerRepository.findOne({
      where: { id: OwnerId },
    });

    if (!owner) {
      throw new ConflictException('가맹주만 답글을 작성할 수 있습니다.');
    }

    const resultOwner = await this.ownercommentRepository.findOne({
      where: {
        owner: { id: OwnerId },
        comment: { id: commentID },
      },
      relations: ['owner', 'comment'],
    });
    if (resultOwner) {
      throw new ConflictException('한 개의 답변만 가능합니다.');
    }
    const result3 = await this.commentRepository.findOne({
      where: { id: commentID },
    });
    const result2 = await this.ownercommentRepository.save({
      owner: {
        ...owner,
      },
      comment: {
        ...result3,
      },

      ...createOwnerCommentInput,
    });

    return result2;
  }

  async update({ UpdateOwnerCommentInput, ownerCommentID, onwerID }) {
    const ownerComment = await this.ownercommentRepository.findOne({
      where: {
        id: ownerCommentID,
      },
      relations: ['owner', 'comment'],
    });
    if (ownerComment.owner.id !== onwerID) {
      throw new ConflictException('수정권한이 없습니다.');
    }
    const newOwner = {
      ...ownerComment,
      ...UpdateOwnerCommentInput,
    };
    return this.ownercommentRepository.save(newOwner);
  }
  async delete({ ownercommentId, ownerID }) {
    const result2 = await this.ownercommentRepository.findOne({
      where: {
        id: ownercommentId,
      },
      relations: ['owner', 'comment'],
    });

    if (result2.owner.id !== ownerID) {
      throw new ConflictException('삭제권한이 없습니다.');
    }
    const result = await this.ownercommentRepository.softDelete({
      id: ownercommentId,
    });
    return result.affected ? true : false;
  }

  async findById({ OwnerID, page }) {
    const result = await this.ownercommentRepository.find({
      take: 10,
      skip: page === undefined ? 0 : (page - 1) * 10,
      where: {
        owner: { id: OwnerID },
      },
      relations: ['owner'],
    });
    return result;
  }

  async findByCommentID({ commentID }) {
    const result = await this.ownercommentRepository.findOne({
      where: {
        comment: { id: commentID },
      },
      relations: ['comment'],
    });

    return result.content;
  }
}
