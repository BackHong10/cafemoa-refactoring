import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { CommentImageService } from './commentimage.service';
import { CommentImageResolver } from './commentimage.resolver';
import { CommentImage } from './entities/commentImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentImage, Comment])],
  providers: [
    CommentImageResolver, //
    CommentImageService,
  ],
})
export class CommentImageModule {}
