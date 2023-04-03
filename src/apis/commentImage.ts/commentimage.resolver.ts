import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CommentImageService } from './commentimage.service';
import { CommentImage } from './entities/commentImage.entity';

@Resolver()
export class CommentImageResolver {
  constructor(
    private readonly commentImageService: CommentImageService, //
  ) {}

  @Query(() => [CommentImage])
  fetchCommentImages() {
    return this.commentImageService.findAll();
  }

  // @Query(() => CommentImage)
  // fetchCommentImage(
  //   @Args('commentId') commentId: string, //
  // ) {
  //   return this.commentImageService.findOne({ commentId });
  // }

  @Query(() => [CommentImage])
  fetchCommentImagesbyID(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentImageService.find({ commentId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteCommentImage(
    @Context() context: IContext, //
    @Args('commentImageID') commnetImageID: string, //
  ) {
    return this.commentImageService.delete({ context, commnetImageID });
  }
}
