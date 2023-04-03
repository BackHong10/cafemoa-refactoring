import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CafeMenuImageService } from './cafemenuImage.service';
import { CafeMenuImage } from './entities/cafemenuimage.entity';

@Resolver()
export class CafeMenuImageResolver {
  constructor(private readonly cafeMenuImageService: CafeMenuImageService) {}

  @Query(() => [CafeMenuImage])
  fetchCafeMenuImage(@Args('CafeInformID') CafeInformID: string) {
    return this.cafeMenuImageService.find({ CafeInformID });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteCafeMenuImage(
    @Args('cafeMenuImageID') cafeMenuImageID: string, //
    @Context() context: IContext,
  ) {
    return this.cafeMenuImageService.delete({ cafeMenuImageID, context });
  }
}
