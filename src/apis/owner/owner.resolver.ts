import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { OwnerInput } from './dto/owner.input';
import { OwnerUpdateInput } from './dto/ownerUpdate.input';
import { Owner } from './entities/owner.entity';
import { OwnerService } from './owner.service';

@Resolver()
export class OwnerResolver {
  constructor(
    private readonly ownerService: OwnerService, //
  ) {}

  @Mutation(() => Owner)
  CreateOwner(
    @Args('createOwnerInput') createOwnerInput: OwnerInput, //
  ) {
    return this.ownerService.create({ createOwnerInput });
  }
  @Query(() => [Owner])
  fetchOwners() {
    return this.ownerService.findAll();
  }

  @Query(() => Owner)
  fetchOwner(@Args('ownerID') ownerID: string) {
    return this.ownerService.findOne({ ownerID });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteOwner(
    @Context() context: IContext, //
  ) {
    return this.ownerService.delete({ ownerID: context.req.user.id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Owner)
  updateOwner(
    @Args('updateOwnerInput') updateOwnerInput: OwnerUpdateInput, //
    @Context() context: IContext,
  ) {
    return this.ownerService.update({
      updateOwnerInput,
      ownerID: context.req.user.id,
    });
  }

  @Mutation(() => String)
  findOwnerPassword(@Args('email') email: string) {
    return this.ownerService.emailPassword({ email });
  }

  @Mutation(() => String)
  sendTokenToOwnerEmail(
    @Args('email') email: string, //
  ) {
    return this.ownerService.sendToken({ email });
  }

  @Mutation(() => String)
  sendTokenToSMS(@Args('phone') phone: string) {
    return this.ownerService.sendTokenToSMS({ phone });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Owner)
  fetchOwnerLoggedIn(
    @Context() context: IContext, //
  ) {
    return this.ownerService.findOne({ ownerID: context.req.user.id });
  }
}
