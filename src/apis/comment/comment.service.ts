import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();

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
      let dayS = String(resultStamp.updatedAt);
      dayS = dayS.slice(0, 10);
      let result = dayS.split('-');
      if (Number(result[0]) < year) {
        throw new ConflictException('댓글을 작성할 수 있는 기간이 지났습니다.');
      } else if (Number(result[0]) === year) {
        if (Number(result[1]) < month) {
          throw new ConflictException(
            '댓글을 작성할 수 있는 기간이 지났습니다.',
          );
        } else if (Number(result[1]) === month) {
          if (Number(result[2]) + 3 < day) {
            throw new ConflictException(
              '댓글을 작성 할 수 있는 기간이 지났습니다.',
            );
          }
        }
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
    });

    if (Like[0].like < 5) {
      throw new ConflictException('해당하는 댓글이 없습니다.');
    } else {
      return Like.slice(0, 3);
    }
  }

  async findcommentwithTags({ Tags, page }) {
    const result = await this.commentRepository.find({
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

    const arr = [];
    result.forEach((el) => {
      el.cafeinfo.cafeTag.forEach((e) => {
        for (let i = 0; i < Tags.length; i++) {
          if (e.tagName === Tags[i]) {
            if (arr.includes(el)) {
              continue;
            } else {
              arr.push(el);
            }
          }
        }
      });
    });
    if (arr.length > 10) {
      const pageNum = Math.ceil(arr.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = arr.slice(i * 10, (i + 1) * 10);
      }
      if (page > pageNum) {
        return [];
      } else {
        return result[page - 1];
      }
    } else {
      if (page > 1) {
        return [];
      } else {
        return arr;
      }
    }
  }
  async findCommentWithLocation({ Location, page }) {
    const result = await this.commentRepository.find({
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
    const answer = [];
    for (let i = 0; i < result.length; i++) {
      const str = result[i].cafeinfo.cafeAddr + result[i].cafeinfo.detailAddr;
      if (str.includes(Location)) {
        answer.push(result[i]);
      }
    }
    if (answer.length > 10) {
      const pageNum = Math.ceil(answer.length / 10);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = answer.slice(i * 10, (i + 1) * 10);
      }
      if (page > pageNum) {
        return [];
      } else {
        return result[page - 1];
      }
    } else {
      if (page > 1) {
        return [];
      } else {
        return answer;
      }
    }
  }

  async findCommentWithLocationAndTag({ Location, Tags, page }) {
    if (Location && Tags.length === 0) {
      const result = await this.findCommentWithLocation({ Location, page });
      return result;
    } else if (!Location && Tags.length > 0) {
      const result = await this.commentRepository.find({
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

      const arr = [];
      result.forEach((el) => {
        el.cafeinfo.cafeTag.forEach((e) => {
          for (let i = 0; i < Tags.length; i++) {
            if (e.tagName === Tags[i]) {
              if (arr.includes(el)) {
                continue;
              } else {
                arr.push(el);
              }
            }
          }
        });
      });
      if (arr.length > 10) {
        const pageNum = Math.ceil(arr.length / 10);
        const result = new Array(pageNum);
        for (let i = 0; i < pageNum; i++) {
          result[i] = arr.slice(i * 10, (i + 1) * 10);
        }
        if (page > pageNum) {
          return [];
        } else {
          return result[page - 1];
        }
      } else {
        if (page > 1) {
          return [];
        } else {
          return arr;
        }
      }
    } else if (Location && Tags.length > 0) {
      const result = await this.findcommentwithTags({ page, Tags });
      return result;
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
