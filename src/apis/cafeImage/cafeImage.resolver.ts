import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CafeImageService } from './cafeImage.service';
import { CafeImage } from './entities/cafeImage.entity';

@Resolver()
export class CafeImageResolver {
  constructor(private readonly cafeImageService: CafeImageService) {}
  @Query(() => [CafeImage])
  fetchCafeImage(
    @Args('cafeInformID') cafeInformID: string, //
  ) {
    return this.cafeImageService.find({ cafeInformID });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCafeImage(
    @Args('cafeImageID') cafeImageID: string, //
    @Context() context: IContext,
  ) {
    return this.cafeImageService.delete({ cafeImageID, context });
  }
}
