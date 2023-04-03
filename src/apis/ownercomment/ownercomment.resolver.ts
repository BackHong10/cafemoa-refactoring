import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OwnerCommentService } from './ownercomment.service';
import { OwnerComment } from './entities/ownercomment.entity';
import { UpdateOwnerCommentInput } from './dto/updateownercomment.input';
import { CreateOwnerCommentInput } from './dto/createownercomment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
@Resolver()
export class OwnerCommentResolver {
  constructor(
    private readonly ownercommentService: OwnerCommentService, //
  ) {}

  @Query(() => [OwnerComment])
  fetchOwnerComment(
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    return this.ownercommentService.findAll({ page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => OwnerComment)
  async createOwnerComment(
    @Args('createOwnerCommentInput')
    createOwnerCommentInput: CreateOwnerCommentInput, //
    @Args('commentID') commentID: string,
    @Context() context: IContext,
  ) {
    return this.ownercommentService.create({
      createOwnerCommentInput,
      OwnerId: context.req.user.id,
      commentID,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => OwnerComment)
  async updateOwnerComment(
    @Args('UpdateOwnerCommentInput')
    UpdateOwnerCommentInput: UpdateOwnerCommentInput,
    @Args('ownerCommentID') ownerCommentID: string,
    @Context() context: IContext,
  ) {
    return this.ownercommentService.update({
      ownerCommentID,
      onwerID: context.req.user.id,
      UpdateOwnerCommentInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [OwnerComment])
  fetchMyOwnerComments(
    @Context() context: IContext, //
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    return this.ownercommentService.findById({
      OwnerID: context.req.user.id,
      page,
    });
  }

  @Query(() => String)
  fetchOwnerCommentByCommentID(@Args('commentID') commentID: string) {
    return this.ownercommentService.findByCommentID({ commentID });
  }
}
