import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { PickList } from './entities/pickList.entity';
import { PickListService } from './pickList.service';

@Resolver()
export class PickListResolver {
  constructor(private readonly pickListService: PickListService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [PickList])
  fetchMyPickLists(
    @Context() context: IContext, //
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
    @Args({ name: 'Location', type: () => String, nullable: true })
    Location: string, //
  ) {
    return this.pickListService.find({
      userID: context.req.user.id,
      page,
      Location,
    });
  }
}
