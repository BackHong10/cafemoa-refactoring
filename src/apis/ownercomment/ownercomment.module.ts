import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerCommentResolver } from './ownercomment.resolver';
import { OwnerCommentService } from './ownercomment.service';
import { Comment } from '../comment/entities/comment.entity';
import { Owner } from '../owner/entities/owner.entity';
import { OwnerComment } from './entities/ownercomment.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Owner, OwnerComment])],
  providers: [
    OwnerCommentResolver, //
    OwnerCommentService,
  ],
})
export class OwnerCommentModule {}
