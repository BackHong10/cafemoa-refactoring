import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeInform } from '../cafeInform/entities/cafeInform.entity';
import { CommentImage } from '../commentImage.ts/entities/commentImage.entity';
import { LikeComment } from '../likeComment/entities/likecomment.entity';
import { PickList } from '../pickList/entities/pickList.entity';
import { Stamp } from '../stamp/entities/stamp.entity';
import { User } from '../user/entities/user.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
      CafeInform,
      CommentImage,
      User,
      LikeComment,
      Stamp,
    ]),
  ],
  providers: [
    CommentResolver, //
    CommentService,
  ],
})
export class CommentModule {}
