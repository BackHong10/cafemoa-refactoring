import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CreateStampInput } from './dto/stamp-create.input';
import { Stamp } from './entities/stamp.entity';
import { StampService } from './stamp.service';

@Resolver()
export class StampResolver {
  constructor(
    private readonly stampService: StampService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Stamp)
  fetchStamp(@Args('stampId') stampId: string) {
    return this.stampService.find({ stampId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchStamps() {
    return this.stampService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stamp])
  fetchUserStamps(
    @Context() context: IContext,
    @Args({ name: 'location', type: () => String, nullable: true })
    location: string,
    @Args({ name: 'page', type: () => Int, nullable: true })
    page: number,
  ) {
    return this.stampService.findUserStamp({
      userId: context.req.user.id,
      location,
      page,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Date])
  fetchCafeStamps(
    @Args('cafeId') cafeId: string,
    @Context() context: IContext,
  ) {
    return this.stampService.findCafeStamp({
      cafeId,
      userId: context.req.user.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Stamp)
  createStamp(@Args('createStampInput') createStampInput: CreateStampInput) {
    return this.stampService.createStamp({ createStampInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteStamp(@Args('stampId') stampId: string, @Context() context: IContext) {
    return this.stampService.deleteStamp({
      stampId,
      userId: context.req.user.id,
    });
  }
}
