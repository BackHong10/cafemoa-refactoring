import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { StampHistory } from './entities/stamphistory.entity';
import { StampHistoryService } from './stamphistory.service';

@Resolver()
export class StampHistoryResolver {
  constructor(private readonly stampHistory: StampHistoryService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [StampHistory])
  fetchUnusualStamps(
    @Context() context: IContext,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ): Promise<StampHistory[]> {
    return this.stampHistory.findStamps({ ownerId: context.req.user.id, page });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  deleteUnusualStamp(
    @Args('ownerpassword') ownerpassword: string,
    @Args('stamphistoryId') stamphistoryId: string,
  ) {
    return this.stampHistory.delete({ ownerpassword, stamphistoryId });
  }
}
