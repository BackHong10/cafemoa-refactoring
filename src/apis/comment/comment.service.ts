import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { CommentImage } from '../commentImage.ts/entities/commentImage.entity';
import { User } from '../user/entities/user.entity';
import { PickList } from '../pickList/entities/pickList.entity';
import { LikeComment } from '../likeComment/entities/likecomment.entity';
import { resourceLimits } from 'worker_threads';
import { Stamp } from '../stamp/entities/stamp.entity';
import { copyFile } from 'fs';
import { throws } from 'assert';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CafeInform)
    private readonly cafeInformrRepository: Repository<CafeInform>,
    @InjectRepository(CommentImage)
    private readonly commentImageRepository: Repository<CommentImage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(LikeComment)
    private readonly likeCommentRepository: Repository<LikeComment>,

    @InjectRepository(Stamp)
    private readonly stampRepository: Repository<Stamp>,
  ) {}
  async findAll({ page }) {
    const result = await this.commentRepository.find({
      take: 10,
      skip: page === undefined ? 1 : (page - 1) * 10,
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
      order: {
        time: 'DESC',
      },
    });

    return result;
  }

  async findOne({ commentId }) {
    const result = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
    });

    return result;
  }
  async findusercomments({ userID, page }) {
    const result = await this.commentRepository.find({
      take: 10,
      skip: page === undefined ? 1 : (page - 1) * 10,
      where: { user: { id: userID } },
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
      order: {
        time: 'DESC',
      },
    });
    return result;
  }

  async create({ createCommentInput, cafeinformId, userID }) {
    const { image_Url, ...Comment } = createCommentInput;
    const date = new Date();
    

    const resultUser = await this.userRepository.findOne({
      where: {
        id: userID,
      },
    });
    if (!resultUser) {
      throw new ConflictException('댓글은 유저만 작성가능합니다.');
    }

    const resultStamp = await this.stampRepository.findOne({
      where: {
        user: {
          id: userID,
        },
        cafeInform: {
          id: cafeinformId,
        },
      },
      relations: ['user', 'cafeInform'],
    });

    if (resultStamp) {
      let date = new Date()
      let year = String(date.getFullYear())
      let month = String((date.getMonth()+1)).padStart(2,"0")
      let day = String(date.getDate()+3).padStart(2,"0")
      let nowDate = `${year}-${month}-${day}`

      let updatedAt = resultStamp.updatedAt
      let uYear = String(updatedAt.getFullYear())
      let uMonth = String(updatedAt.getMonth()+1)
      let uDay = String(updatedAt.getDate()+1)
      let updateDate = `${uYear}-${uMonth}-${uDay}`

      if(nowDate < updateDate){
        throw new ConflictException('댓글을 쓸 수 있는 기간이 지났습니다.');
      }
      
    } else {
      throw new ConflictException('해당 카페의 스탬프 기록이 없습니다.');
    }

    const result = await this.cafeInformrRepository.findOne({
      where: { id: cafeinformId },
    });

    const result2 = await this.commentRepository.save({
      cafeinfo: {
        ...result,
      },
      user: {
        ...resultUser,
      },
      ...Comment,
    });
    if (image_Url) {
      for (let i = 0; i < image_Url.length; i++) {
        this.commentImageRepository.save({
          image_url: image_Url[i],
          comment: {
            ...result2,
          },
        });
      }
    }

    return result2;
  }

  async update({ commentId, UpdateCommentInput, userID }) {
    const { image_Url, ...comment } = UpdateCommentInput;
    const mycomment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
    });

    if (mycomment.user.id !== userID) {
      throw new ConflictException('수정권한이 없습니다.');
    }

    const result = await this.commentRepository.save({
      ...mycomment,
      ...comment,
    });
    if (image_Url) {
      await this.commentImageRepository.delete({
        comment: {
          id: mycomment.id,
        },
      });
      for (let i = 0; i < image_Url.length; i++) {
        this.commentImageRepository.save({
          image_url: image_Url[i],
          comment: {
            ...result,
          },
        });
      }
    }
    return result;
  }
  async delete({ commentId, userID }) {
    const resultUser = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ['user'],
    });
    if (resultUser.user.id !== userID) {
      throw new ConflictException('삭제권한이 없습니다.');
    }
    const result = await this.commentRepository.softDelete({ id: commentId });
    return result.affected ? '삭제에 성공했습니다.' : '삭제에 실패했습니다.';
  }

  async sendBestComment() {
    const Like = await this.commentRepository.find({
      order: {
        like: 'DESC',
      },
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
      take: 5
    });

    if (Like[0].like < 5) {
      throw new ConflictException('해당하는 댓글이 없습니다.');
    } else {
      return Like
    }
  }

  async findcommentwithTags({ Tags, page }) {
    const result = await this.commentRepository.find({
      where: {
        cafeinfo: {
          cafeTag: {
            tagName: In(Tags)
          }
        }
      },
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
      order: {
        time: 'DESC',
      },
      take: 10,
      skip: page === undefined ? 0 : (page-1) * 10
    });
    return result
  }
  async findCommentWithLocation({ Location, page }) {
    const result = await this.commentRepository.find({
      where:[
        {cafeinfo :{
          cafeAddr : Like(`%${Location}%`)
        }},
        {cafeinfo :{
          detailAddr : Like(`%${Location}%`)
        }}
      ],
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
      order: {
        time: 'DESC',
      },
      take: 10,
      skip: page === undefined ? 0 : (page-1) * 10
    });
    return result
    
  }

  async findCommentWithLocationAndTag({ Location, Tags, page }) {
    if (Location && Tags.length === 0) {
      const result = await this.findCommentWithLocation({ Location, page });
      return result;
    } else if (!Location && Tags.length > 0) {
      const result = await this.findcommentwithTags({Tags,page})
      return result
    } else if (Location && Tags.length > 0) {
      return this.commentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.cafeinfo','cafeinfo')
      .innerJoinAndSelect('cafeinfo.cafeTag','cafeTag')
      .innerJoinAndSelect('comment.user','user')
      .innerJoinAndSelect('comment.commentImage','commentImage')
      .innerJoinAndSelect('cafeinfo.owner','owner')
      .where('cafeTag.tagName In (:...Tags)',{Tags})
      .andWhere('cafeinfo.cafeAddr Like:Location OR cafeinfo.detailAddr Like:Location',{Location : `%${Location}%`})
      .take(10)
      .skip(page === undefined ? 0 : (page-1) * 10)
      .getMany()
    } else {
      const result = await this.findAll({ page });
      return result;
    }
  }

  async likeComment({ commentID, userID }) {
    const user = await this.userRepository.findOne({
      where: {
        id: userID,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException(
        '가맹주는 좋아요를 할 수 없습니다.',
      );
    }

    const comment = await this.commentRepository.findOne({
      where: {
        id: commentID,
      },
    });
    const likeComment = await this.likeCommentRepository.findOne({
      where: {
        user: { id: userID },
        comment: { id: commentID },
      },
      relations: ['user', 'comment'],
    });
    if (likeComment) {
      await this.commentRepository.update(
        {
          id: commentID,
        },
        {
          like: comment.like - 1,
        },
      );
      await this.likeCommentRepository.delete({ id: likeComment.id });
      const result = await this.commentRepository.findOne({
        where: {
          id: commentID,
        },
      });
      return result.like;
    } else {
      await this.commentRepository.update(
        {
          id: commentID,
        },
        {
          like: comment.like + 1,
        },
      );
      const updatedComment = await this.commentRepository.findOne({
        where: {
          id: commentID,
        },
      });
      await this.likeCommentRepository.save({
        user: {
          ...user,
        },
        comment: {
          ...updatedComment,
        },
      });
      return updatedComment.like;
    }
  }
  async findCommentBycafeID({ cafeID, page }) {
    const result = await this.commentRepository.find({
      where: {
        cafeinfo: { id: cafeID },
      },
      relations: [
        'cafeinfo',
        'cafeinfo.cafeTag',
        'user',
        'commentImage',
        'cafeinfo.owner',
      ],
      order: {
        time: 'DESC',
      },
      take: 10,
      skip: page === undefined ? 1 : (page - 1) * 10,
    });
    return result;
  }
}
