import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { gql } from 'apollo-server-express';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CafeInformService } from './cafeInform.service';
import { CafeInformInput } from './dto/cafeinform.input';
import { UpdateCafeInform } from './dto/updatecafeinform.input';
import { CafeInform } from './entities/cafeInform.entity';

@Resolver()
export class CafeInformResolver {
  constructor(private readonly cafeInformService: CafeInformService) {}

  @Query(() => CafeInform)
  fetchCafeInform(@Args('cafeInformID') cafeInformID: string) {
    return this.cafeInformService.findOne({ cafeInformID });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeInform)
  updateCafeInform(
    @Args('updateCafeInform') updateCafeInform: UpdateCafeInform, //
    @Args('cafeInformID') CafeInformID: string,
    @Context() context: IContext,
  ) {
    return this.cafeInformService.update({
      updateCafeInform,
      CafeInformID,
      context,
    });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CafeInform)
  CreatecafeInform(
    @Args('cafeInformInput') cafeInformInput: CafeInformInput, //
    @Context() context: IContext,
  ) {
    return this.cafeInformService.create({
      cafeInformInput,
      OwnerId: context.req.user.id,
    });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  PickCafe(
    @Args('cafeInformID') CafeInformID: string, //
    @Context() context: IContext,
  ) {
    return this.cafeInformService.pickcafe({
      CafeInformID,
      UserID: context.req.user.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCafeInform(
    @Args('cafeInformID') cafeInformID: string, //
    @Context() context: IContext,
  ) {
    return this.cafeInformService.deleteCafeInform({ cafeInformID, context });
  }

  @Query(() => [CafeInform])
  fetchBestCafe() {
    return this.cafeInformService.findBestCafe();
  }

  @Query(() => [CafeInform])
  fetchCafeInforms(
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    return this.cafeInformService.findAll({ page });
  }

  @Query(() => [CafeInform])
  fetchCafes(
    @Args({ name: 'location', type: () => String, nullable: true })
    Location: string,
    @Args({ name: 'tags', type: () => [String], nullable: true })
    Tags: string[],
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    return this.cafeInformService.findCafeWithLocationAndTag({
      Location,
      Tags,
      page,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CafeInform])
  fetchMyCafes(
    @Context() context: IContext, //
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
  ) {
    return this.cafeInformService.findMyCafes({
      ownerID: context.req.user.id,
      page,
    });
  }

  @Query(() => [CafeInform])
  fetchCafesWithNameAndLocation(
    @Args({ name: 'name', type: () => String, nullable: true }) name: string,
    @Args({ name: 'page', type: () => Int, nullable: true }) page: number,
    @Args({ name: 'location', type: () => String, nullable: true })
    Location: string,
  ) {
    return this.cafeInformService.findCafeByName({ name, page, Location });
  }

  // @Query(() => [CafeInform])
  // fetchTest(
  //   @Args({ name: 'location', type: () => String, nullable: true })
  //   location: string,
  //   @Args({ name: 'tags', type: () => [String], nullable: true })
  //   tags: string[],
  // ){
  //   return this.cafeInformService.test(location,tags)
  // }
}
